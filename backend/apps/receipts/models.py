# backend/apps/receipts/models.py
from django.db import models
from apps.orders.models import Order
from apps.payments.models import Payment
import uuid


class Receipt(models.Model):
    receipt_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    order          = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='receipt')
    payment        = models.OneToOneField(Payment, on_delete=models.SET_NULL, null=True, related_name='receipt')
    barcode        = models.CharField(max_length=100, unique=True, blank=True)
    pdf_file       = models.FileField(upload_to='receipts/', null=True, blank=True)
    printed        = models.BooleanField(default=False)
    printed_at     = models.DateTimeField(null=True, blank=True)
    printed_by     = models.ForeignKey(
        'accounts.User', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='printed_receipts'
    )
    emailed        = models.BooleanField(default=False)
    emailed_at     = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Receipt {str(self.receipt_number)[:8]} — Order {str(self.order.order_number)[:8]}'

    def save(self, *args, **kwargs):
        if not self.barcode:
            self.barcode = str(self.receipt_number).replace('-', '').upper()[:20]
        super().save(*args, **kwargs)
