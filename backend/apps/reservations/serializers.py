# backend/apps/reservations/serializers.py
from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model  = Reservation
        fields = [
            'id', 'ref_number', 'customer', 'customer_name',
            'name', 'phone', 'email', 'date', 'time',
            'guests', 'occasion', 'table_number',
            'special_requests', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'ref_number', 'customer', 'status', 'created_at']


class CreateReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Reservation
        fields = ['name', 'phone', 'email', 'date', 'time', 'guests', 'occasion', 'special_requests']
