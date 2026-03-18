# backend/apps/reservations/models.py
from django.db import models
from apps.accounts.models import User
import uuid


class Reservation(models.Model):

    STATUS_PENDING   = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_SEATED    = 'seated'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_NO_SHOW   = 'no_show'

    STATUS_CHOICES = [
        (STATUS_PENDING,   'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_SEATED,    'Seated'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_NO_SHOW,   'No Show'),
    ]

    OCCASION_REGULAR    = 'regular'
    OCCASION_BIRTHDAY   = 'birthday'
    OCCASION_ANNIVERSARY = 'anniversary'
    OCCASION_BUSINESS   = 'business'
    OCCASION_OTHER      = 'other'

    OCCASION_CHOICES = [
        (OCCASION_REGULAR,     'Regular Dining'),
        (OCCASION_BIRTHDAY,    'Birthday'),
        (OCCASION_ANNIVERSARY, 'Anniversary'),
        (OCCASION_BUSINESS,    'Business Dinner'),
        (OCCASION_OTHER,       'Other'),
    ]

    ref_number   = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    customer     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reservations')
    name         = models.CharField(max_length=150)
    phone        = models.CharField(max_length=20)
    email        = models.EmailField(blank=True)
    date         = models.DateField()
    time         = models.TimeField()
    guests       = models.IntegerField()
    occasion     = models.CharField(max_length=20, choices=OCCASION_CHOICES, default=OCCASION_REGULAR)
    table_number = models.CharField(max_length=10, blank=True)
    special_requests = models.TextField(blank=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    confirmed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='confirmed_reservations'
    )
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f'{self.name} — {self.date} {self.time} ({self.guests} guests)'
