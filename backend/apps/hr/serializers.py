# backend/apps/hr/serializers.py
from rest_framework import serializers
from .models import LeaveRequest, EmployeeScore, Attendance


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.name', read_only=True)

    class Meta:
        model  = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'leave_type',
            'start_date', 'end_date', 'days', 'reason',
            'status', 'reviewed_by', 'reviewed_by_name',
            'review_note', 'reviewed_at', 'created_at'
        ]
        read_only_fields = ['id', 'employee', 'status', 'reviewed_by', 'reviewed_at', 'created_at']


class EmployeeScoreSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.name', read_only=True)
    department    = serializers.CharField(source='employee.department', read_only=True)

    class Meta:
        model  = EmployeeScore
        fields = [
            'id', 'employee', 'employee_name', 'department',
            'month', 'orders_served', 'tips_received',
            'attendance_pct', 'leave_days_taken',
            'manager_rating', 'manager_comment',
            'total_score', 'rank', 'is_employee_of_month'
        ]
        read_only_fields = ['id', 'total_score', 'rank']


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.name', read_only=True)

    class Meta:
        model  = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status', 'check_in', 'check_out', 'note']
        read_only_fields = ['id']
