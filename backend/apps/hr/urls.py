# backend/apps/hr/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('leave/apply/',              views.apply_leave,        name='apply-leave'),
    path('leave/',                    views.list_leaves,        name='list-leaves'),
    path('leave/<int:pk>/review/',    views.review_leave,       name='review-leave'),
    path('rankings/',                 views.employee_rankings,  name='employee-rankings'),
    path('rate/<int:employee_id>/',   views.rate_employee,      name='rate-employee'),
    path('attendance/',               views.list_attendance,    name='list-attendance'),
    path('attendance/mark/',          views.mark_attendance,    name='mark-attendance'),
]
