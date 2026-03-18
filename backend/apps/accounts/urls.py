# backend/apps/accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/',             views.register_customer,   name='register-customer'),
    path('profile/',              views.get_profile,         name='get-profile'),
    path('profile/update/',       views.update_profile,      name='update-profile'),
    path('employees/',            views.list_employees,      name='list-employees'),
    path('employees/register/',   views.register_employee,   name='register-employee'),
    path('employees/<int:employee_id>/deactivate/', views.deactivate_employee, name='deactivate-employee'),
    path('customers/',            views.list_customers,      name='list-customers'),
]
