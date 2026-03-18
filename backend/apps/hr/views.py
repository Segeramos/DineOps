# backend/apps/hr/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import LeaveRequest, EmployeeScore, Attendance
from .serializers import LeaveRequestSerializer, EmployeeScoreSerializer, AttendanceSerializer
from apps.accounts.models import Employee


# ── Leave Requests ────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leave(request):
    try:
        employee = request.user.employee_profile
    except Employee.DoesNotExist:
        return Response({'error': 'Only employees can apply for leave.'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    start_date = data.get('start_date')
    end_date   = data.get('end_date')
    leave_type = data.get('leave_type')

    # Calculate days
    from datetime import date
    start = date.fromisoformat(start_date)
    end   = date.fromisoformat(end_date)
    days  = (end - start).days + 1

    # Check balance
    balance_map = {
        'annual':    employee.annual_leave_balance,
        'sick':      employee.sick_leave_balance,
        'emergency': employee.emergency_leave_balance,
    }
    if leave_type in balance_map and balance_map[leave_type] < days:
        return Response(
            {'error': f'Insufficient {leave_type} leave balance. Available: {balance_map[leave_type]} days.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    leave = LeaveRequest.objects.create(
        employee   = employee,
        leave_type = leave_type,
        start_date = start_date,
        end_date   = end_date,
        days       = days,
        reason     = data.get('reason', ''),
    )
    return Response(LeaveRequestSerializer(leave).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_leaves(request):
    if request.user.is_admin:
        leaves = LeaveRequest.objects.all().select_related('employee__user')
        status_filter = request.query_params.get('status')
        if status_filter:
            leaves = leaves.filter(status=status_filter)
    else:
        try:
            employee = request.user.employee_profile
            leaves = LeaveRequest.objects.filter(employee=employee)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(LeaveRequestSerializer(leaves, many=True).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def review_leave(request, pk):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        leave = LeaveRequest.objects.get(pk=pk)
        new_status  = request.data.get('status')
        review_note = request.data.get('review_note', '')

        if new_status not in ['approved', 'rejected']:
            return Response({'error': 'Status must be approved or rejected.'}, status=status.HTTP_400_BAD_REQUEST)

        leave.status      = new_status
        leave.reviewed_by = request.user
        leave.review_note = review_note
        leave.reviewed_at = timezone.now()
        leave.save()

        # Deduct balance if approved
        if new_status == 'approved':
            employee = leave.employee
            if leave.leave_type == 'annual':
                employee.annual_leave_balance -= leave.days
            elif leave.leave_type == 'sick':
                employee.sick_leave_balance -= leave.days
            elif leave.leave_type == 'emergency':
                employee.emergency_leave_balance -= leave.days
            employee.save()

        return Response(LeaveRequestSerializer(leave).data)
    except LeaveRequest.DoesNotExist:
        return Response({'error': 'Leave request not found.'}, status=status.HTTP_404_NOT_FOUND)


# ── Employee Rankings ─────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_rankings(request):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    month = request.query_params.get('month')
    scores = EmployeeScore.objects.select_related('employee__user')
    if month:
        scores = scores.filter(month=month)
    scores = scores.order_by('-total_score')

    # Update ranks
    for i, score in enumerate(scores):
        score.rank = i + 1
        score.save(update_fields=['rank'])

    return Response(EmployeeScoreSerializer(scores, many=True).data)


@api_view(['POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def rate_employee(request, employee_id):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    from datetime import date
    month = date.today().replace(day=1)

    score, created = EmployeeScore.objects.get_or_create(
        employee=employee,
        month=month,
    )
    score.manager_rating  = request.data.get('manager_rating', score.manager_rating)
    score.manager_comment = request.data.get('manager_comment', score.manager_comment)
    score.rated_by        = request.user
    score.save()

    return Response(EmployeeScoreSerializer(score).data)


# ── Attendance ────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(recorded_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_attendance(request):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

    attendance = Attendance.objects.select_related('employee__user').all()
    date_filter = request.query_params.get('date')
    if date_filter:
        attendance = attendance.filter(date=date_filter)
    employee_filter = request.query_params.get('employee')
    if employee_filter:
        attendance = attendance.filter(employee_id=employee_filter)

    return Response(AttendanceSerializer(attendance, many=True).data)
