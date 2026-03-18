# backend/apps/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Base user — extended by Customer and Employee profiles."""

    ROLE_SUPERADMIN = 'superadmin'
    ROLE_ADMIN      = 'admin'
    ROLE_CUSTOMER   = 'customer'

    ROLE_CHOICES = [
        (ROLE_SUPERADMIN, 'Super Admin'),
        (ROLE_ADMIN,      'Admin'),
        (ROLE_CUSTOMER,   'Customer'),
    ]

    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)
    name         = models.CharField(max_length=150, blank=True)
    phone        = models.CharField(max_length=20, blank=True)
    role         = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)
    avatar       = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)

    def __str__(self):
        return f'{self.name or self.email} ({self.role})'

    @property
    def is_superadmin(self):
        return self.role == self.ROLE_SUPERADMIN

    @property
    def is_admin(self):
        return self.role in [self.ROLE_SUPERADMIN, self.ROLE_ADMIN]

    @property
    def is_customer(self):
        return self.role == self.ROLE_CUSTOMER


class Customer(models.Model):
    """Extended profile for customers."""
    user          = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    loyalty_pts   = models.IntegerField(default=0)
    is_vip        = models.BooleanField(default=False)
    date_of_birth = models.DateField(null=True, blank=True)
    notes         = models.TextField(blank=True)

    def __str__(self):
        return f'Customer: {self.user.name}'


class Employee(models.Model):
    """Extended profile for staff."""

    DEPT_FOH    = 'front_of_house'   # waiters, hosts
    DEPT_BOH    = 'back_of_house'    # kitchen
    DEPT_BAR    = 'bar'
    DEPT_MGMT   = 'management'
    DEPT_FINANCE = 'finance'

    DEPT_CHOICES = [
        (DEPT_FOH,    'Front of House'),
        (DEPT_BOH,    'Back of House'),
        (DEPT_BAR,    'Bar'),
        (DEPT_MGMT,   'Management'),
        (DEPT_FINANCE,'Finance'),
    ]

    user            = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    employee_id     = models.CharField(max_length=20, unique=True)
    department      = models.CharField(max_length=30, choices=DEPT_CHOICES)
    position        = models.CharField(max_length=100)
    date_joined     = models.DateField()
    salary          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    national_id     = models.CharField(max_length=20, blank=True)
    emergency_contact_name  = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)

    # Leave balances (days remaining)
    annual_leave_balance      = models.FloatField(default=21)
    sick_leave_balance        = models.FloatField(default=7)
    emergency_leave_balance   = models.FloatField(default=3)

    is_active       = models.BooleanField(default=True)
    registered_by   = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='registered_employees'
    )
    created_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.name} — {self.position}'
