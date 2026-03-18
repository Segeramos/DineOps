# backend/apps/hr/models.py
from django.db import models
from apps.accounts.models import User, Employee


class LeaveRequest(models.Model):

    TYPE_ANNUAL       = 'annual'
    TYPE_SICK         = 'sick'
    TYPE_EMERGENCY    = 'emergency'
    TYPE_MATERNITY    = 'maternity'
    TYPE_PATERNITY    = 'paternity'
    TYPE_UNPAID       = 'unpaid'
    TYPE_COMPASSIONATE = 'compassionate'
    TYPE_STUDY        = 'study'

    LEAVE_TYPES = [
        (TYPE_ANNUAL,        'Annual Leave'),
        (TYPE_SICK,          'Sick Leave'),
        (TYPE_EMERGENCY,     'Emergency Leave'),
        (TYPE_MATERNITY,     'Maternity Leave'),
        (TYPE_PATERNITY,     'Paternity Leave'),
        (TYPE_UNPAID,        'Unpaid Leave'),
        (TYPE_COMPASSIONATE, 'Compassionate Leave'),
        (TYPE_STUDY,         'Study Leave'),
    ]

    STATUS_PENDING  = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING,   'Pending'),
        (STATUS_APPROVED,  'Approved'),
        (STATUS_REJECTED,  'Rejected'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    employee    = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type  = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date  = models.DateField()
    end_date    = models.DateField()
    days        = models.FloatField()
    reason      = models.TextField()
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    reviewed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviewed_leaves')
    review_note = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.employee.user.name} — {self.leave_type} ({self.status})'


class EmployeeScore(models.Model):
    """Monthly performance score — auto-calculated + manager input."""

    employee        = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='scores')
    month           = models.DateField()  # store as first day of month e.g. 2026-03-01

    # Auto-calculated from system data
    orders_served   = models.IntegerField(default=0)
    tips_received   = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    attendance_pct  = models.FloatField(default=0)   # 0–100
    leave_days_taken = models.FloatField(default=0)

    # Manager input
    manager_rating  = models.FloatField(default=0)   # 0–5
    manager_comment = models.TextField(blank=True)
    rated_by        = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    # Calculated total score (0–100)
    total_score     = models.FloatField(default=0)
    rank            = models.IntegerField(default=0)
    is_employee_of_month = models.BooleanField(default=False)

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('employee', 'month')
        ordering = ['-month', 'rank']

    def calculate_score(self):
        """
        Score formula (total 100):
        - Orders served:   25 pts  (normalized against team max)
        - Tips received:   20 pts  (normalized against team max)
        - Attendance:      25 pts  (attendance_pct / 4)
        - Manager rating:  20 pts  (manager_rating * 4)
        - Leave penalty:   10 pts  (10 - leave_days_taken, min 0)
        """
        orders_score    = min(self.orders_served / 2, 25)
        tips_score      = min(float(self.tips_received) / 200, 20)
        attendance_score = (self.attendance_pct / 100) * 25
        rating_score    = (self.manager_rating / 5) * 20
        leave_score     = max(10 - self.leave_days_taken, 0)

        self.total_score = round(
            orders_score + tips_score + attendance_score + rating_score + leave_score, 2
        )
        return self.total_score

    def save(self, *args, **kwargs):
        self.calculate_score()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.employee.user.name} — {self.month.strftime("%B %Y")} — Score: {self.total_score}'


class Attendance(models.Model):
    """Daily attendance records."""

    STATUS_PRESENT  = 'present'
    STATUS_ABSENT   = 'absent'
    STATUS_LATE     = 'late'
    STATUS_HALF_DAY = 'half_day'
    STATUS_ON_LEAVE = 'on_leave'

    STATUS_CHOICES = [
        (STATUS_PRESENT,  'Present'),
        (STATUS_ABSENT,   'Absent'),
        (STATUS_LATE,     'Late'),
        (STATUS_HALF_DAY, 'Half Day'),
        (STATUS_ON_LEAVE, 'On Leave'),
    ]

    employee    = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance')
    date        = models.DateField()
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PRESENT)
    check_in    = models.TimeField(null=True, blank=True)
    check_out   = models.TimeField(null=True, blank=True)
    note        = models.CharField(max_length=200, blank=True)
    recorded_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        unique_together = ('employee', 'date')
        ordering = ['-date']

    def __str__(self):
        return f'{self.employee.user.name} — {self.date} — {self.status}'
