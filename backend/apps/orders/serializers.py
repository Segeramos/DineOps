# backend/apps/orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from apps.menu.serializers import MenuItemSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['id', 'menu_item', 'name', 'price', 'quantity', 'subtotal', 'notes']
        read_only_fields = ['id', 'name', 'price', 'subtotal']


class OrderItemCreateSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity     = serializers.IntegerField(min_value=1)
    notes        = serializers.CharField(required=False, allow_blank=True)


class OrderSerializer(serializers.ModelSerializer):
    items        = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'order_number', 'customer', 'customer_name',
            'order_type', 'status', 'table_number',
            'subtotal', 'tax', 'tip', 'total',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'subtotal', 'tax', 'total', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    order_type   = serializers.ChoiceField(choices=['dine_in', 'takeaway', 'delivery'])
    table_number = serializers.CharField(required=False, allow_blank=True)
    notes        = serializers.CharField(required=False, allow_blank=True)
    items        = OrderItemCreateSerializer(many=True)
