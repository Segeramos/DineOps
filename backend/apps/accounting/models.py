# backend/apps/accounting/models.py
from django.db import models
from apps.accounts.models import User
from apps.payments.models import Payment


class Transaction(models.Model):
    """Every payment creates a transaction record automatically."""

    TYPE_SALE    = 'sale'
    TYPE_REFUND  = 'refund'
    TYPE_TIP     = 'tip'
    TYPE_EXPENSE = 'expense'

    TYPE_CHOICES = [
        (TYPE_SALE,    'Sale'),
        (TYPE_REFUND,  'Refund'),
        (TYPE_TIP,     'Tip'),
        (TYPE_EXPENSE, 'Expense'),
    ]

    payment      = models.OneToOneField(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='transaction')
    type         = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount       = models.DecimalField(max_digits=10, decimal_places=2)
    tip_amount   = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount   = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description  = models.CharField(max_length=300, blank=True)
    recorded_by  = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='transactions')
    date         = models.DateField(auto_now_add=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.type} — Ksh {self.amount} on {self.date}'


class DailyReport(models.Model):
    """Auto-generated daily summary."""
    date             = models.DateField(unique=True)
    total_sales      = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tips       = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tax        = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_refunds    = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders     = models.IntegerField(default=0)
    mpesa_sales      = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    card_sales       = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    paypal_sales     = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cash_sales       = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    generated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'Daily Report — {self.date} — Ksh {self.total_sales}'
