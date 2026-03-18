# backend/apps/menu/serializers.py
from rest_framework import serializers
from .models import Category, MenuItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'image', 'order', 'is_active']


class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model  = MenuItem
        fields = [
            'id', 'category', 'category_name', 'name', 'description',
            'price', 'image', 'is_available', 'is_featured',
            'is_vegetarian', 'is_spicy', 'prep_time',
            'calories', 'allergens', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
