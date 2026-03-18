# backend/apps/accounts/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Customer, Employee
from .serializers import (
    UserSerializer, RegisterSerializer, CustomerSerializer,
    EmployeeSerializer, RegisterEmployeeSerializer
)
import uuid

User = get_user_model()


# ── Register customer (called after Firebase signup) ──────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_customer(request):
    """
    Called after Firebase signup to create Django user + customer profile.
    Firebase middleware already created the user — we just update the profile.
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # Create customer profile if not exists
        Customer.objects.get_or_create(user=user)
        return Response({
            'message': 'Profile updated successfully.',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Get current user profile ──────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    data = UserSerializer(user).data

    # Add role-specific profile
    if user.role == User.ROLE_CUSTOMER:
        try:
            data['profile'] = CustomerSerializer(user.customer_profile).data
        except Customer.DoesNotExist:
            Customer.objects.create(user=user)
            data['profile'] = {}
    elif user.role in [User.ROLE_ADMIN, User.ROLE_SUPERADMIN]:
        try:
            data['profile'] = EmployeeSerializer(user.employee_profile).data
        except Employee.DoesNotExist:
            data['profile'] = {}

    return Response(data)


# ── Update profile ────────────────────────────────────────────────
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Profile updated.', 'user': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Register employee (superadmin only) ───────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_employee(request):
    if not request.user.is_superadmin:
        return Response({'error': 'Only super admins can register employees.'},
                        status=status.HTTP_403_FORBIDDEN)

    serializer = RegisterEmployeeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    email = data['email']

    if User.objects.filter(email=email).exists():
        return Response({'error': 'User with this email already exists.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Create user
    user = User.objects.create(
        email        = email,
        username     = email,
        name         = data['name'],
        phone        = data['phone'],
        role         = data['role'],
    )

    # Generate employee ID
    emp_id = f"EMP-{str(uuid.uuid4())[:6].upper()}"

    # Create employee profile
    Employee.objects.create(
        user                    = user,
        employee_id             = emp_id,
        department              = data['department'],
        position                = data['position'],
        date_joined             = data['date_joined'],
        salary                  = data['salary'],
        national_id             = data.get('national_id', ''),
        emergency_contact_name  = data.get('emergency_contact_name', ''),
        emergency_contact_phone = data.get('emergency_contact_phone', ''),
        registered_by           = request.user,
    )

    return Response({
        'message': f'Employee registered successfully. ID: {emp_id}',
        'employee_id': emp_id,
        'email': email,
    }, status=status.HTTP_201_CREATED)


# ── List all customers (admin+) ───────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_customers(request):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    customers = Customer.objects.select_related('user').all()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)


# ── List all employees (admin+) ───────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_employees(request):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    employees = Employee.objects.select_related('user').filter(is_active=True)
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


# ── Deactivate employee (superadmin only) ─────────────────────────
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def deactivate_employee(request, employee_id):
    if not request.user.is_superadmin:
        return Response({'error': 'Only super admins can deactivate employees.'},
                        status=status.HTTP_403_FORBIDDEN)
    try:
        employee = Employee.objects.get(id=employee_id)
        employee.is_active = False
        employee.save()
        employee.user.is_active = False
        employee.user.save()
        return Response({'message': 'Employee deactivated successfully.'})
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
