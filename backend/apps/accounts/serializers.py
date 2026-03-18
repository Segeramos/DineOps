# backend/apps/accounts/serializers.py
from rest_framework import serializers
from .models import User, Customer, Employee


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'email', 'name', 'phone', 'role', 'avatar', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['email', 'name', 'phone', 'firebase_uid']

    def create(self, validated_data):
        user = User.objects.create(
            email        = validated_data['email'],
            username     = validated_data['email'],
            name         = validated_data.get('name', ''),
            phone        = validated_data.get('phone', ''),
            firebase_uid = validated_data.get('firebase_uid', ''),
            role         = User.ROLE_CUSTOMER,
        )
        Customer.objects.create(user=user)
        return user


class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Customer
        fields = ['id', 'user', 'loyalty_pts', 'is_vip', 'date_of_birth', 'notes']


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Employee
        fields = [
            'id', 'user', 'employee_id', 'department', 'position',
            'date_joined', 'salary', 'national_id',
            'emergency_contact_name', 'emergency_contact_phone',
            'annual_leave_balance', 'sick_leave_balance',
            'emergency_leave_balance', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RegisterEmployeeSerializer(serializers.Serializer):
    email       = serializers.EmailField()
    name        = serializers.CharField()
    phone       = serializers.CharField()
    role        = serializers.ChoiceField(choices=[('admin', 'Admin'), ('superadmin', 'Super Admin')])
    department  = serializers.CharField()
    position    = serializers.CharField()
    date_joined = serializers.DateField()
    salary      = serializers.DecimalField(max_digits=10, decimal_places=2)
    national_id = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_name  = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_phone = serializers.CharField(required=False, allow_blank=True)
