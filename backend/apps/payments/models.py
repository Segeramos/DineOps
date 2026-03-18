# backend/apps/payments/models.py
from django.db import models
from apps.accounts.models import User
from apps.orders.models import Order
import uuid


class Payment(models.Model):

    METHOD_MPESA   = 'mpesa'
    METHOD_CARD    = 'card'
    METHOD_PAYPAL  = 'paypal'
    METHOD_CASH    = 'cash'

    METHOD_CHOICES = [
        (METHOD_MPESA,  'Mpesa'),
        (METHOD_CARD,   'Debit/Credit Card'),
        (METHOD_PAYPAL, 'PayPal'),
        (METHOD_CASH,   'Cash'),
    ]

    STATUS_PENDING   = 'pending'
    STATUS_SUCCESS   = 'success'
    STATUS_FAILED    = 'failed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_REFUNDED  = 'refunded'

    STATUS_CHOICES = [
        (STATUS_PENDING,   'Pending'),
        (STATUS_SUCCESS,   'Success'),
        (STATUS_FAILED,    'Failed'),
        (STATUS_CANCELLED, 'Cancelled'),
        (STATUS_REFUNDED,  'Refunded'),
    ]

    payment_ref  = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    order        = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    customer     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments')
    method       = models.CharField(max_length=20, choices=METHOD_CHOICES)
    amount       = models.DecimalField(max_digits=10, decimal_places=2)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)

    # Gateway transaction references
    mpesa_ref         = models.CharField(max_length=100, blank=True)
    mpesa_receipt     = models.CharField(max_length=100, blank=True)
    stripe_payment_id = models.CharField(max_length=100, blank=True)
    paypal_order_id   = models.CharField(max_length=100, blank=True)
    cash_received_by  = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='cash_payments_received'
    )

    tip           = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes         = models.TextField(blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Payment {str(self.payment_ref)[:8]} — {self.method} — Ksh {self.amount} ({self.status})'
