# backend/apps/payments/admin.py
from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ['payment_ref', 'order', 'method', 'amount', 'status', 'created_at']
    list_filter   = ['method', 'status']
    search_fields = ['payment_ref', 'mpesa_receipt', 'stripe_payment_id', 'paypal_order_id']
    ordering      = ['-created_at']
