# backend/utils/permissions.py
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """Only superadmin can access."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superadmin


class IsAdminOrSuperAdmin(BasePermission):
    """Admin and superadmin can access."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsCustomer(BasePermission):
    """Only customers can access."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_customer


class IsOwnerOrAdmin(BasePermission):
    """Owner of the object or admin can access."""
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        # Check if object has a user or customer field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'customer'):
            return obj.customer == request.user
        return False
