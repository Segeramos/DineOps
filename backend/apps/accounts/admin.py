# backend/apps/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Customer, Employee


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['email', 'name', 'role', 'is_active', 'created_at']
    list_filter   = ['role', 'is_active']
    search_fields = ['email', 'name', 'phone']
    ordering      = ['-created_at']
    fieldsets     = BaseUserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('firebase_uid', 'name', 'phone', 'role', 'avatar')}),
    )


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display  = ['user', 'loyalty_pts', 'is_vip']
    list_filter   = ['is_vip']
    search_fields = ['user__email', 'user__name']


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display  = ['user', 'employee_id', 'department', 'position', 'is_active']
    list_filter   = ['department', 'is_active']
    search_fields = ['user__email', 'user__name', 'employee_id']
