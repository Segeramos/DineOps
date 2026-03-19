# backend/apps/payments/serializers.py
from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model  = Payment
        fields = [
            'id', 'payment_ref', 'order', 'order_number',
            'method', 'amount', 'status', 'tip',
            'mpesa_receipt', 'stripe_payment_id', 'paypal_order_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_ref', 'created_at', 'updated_at']
