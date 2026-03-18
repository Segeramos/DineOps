# backend/apps/menu/models.py
from django.db import models


class Category(models.Model):
    name       = models.CharField(max_length=100)
    slug       = models.SlugField(unique=True)
    image      = models.ImageField(upload_to='categories/', null=True, blank=True)
    order      = models.IntegerField(default=0)
    is_active  = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='items')
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    image       = models.ImageField(upload_to='menu/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    is_featured  = models.BooleanField(default=False)
    is_vegetarian = models.BooleanField(default=False)
    is_spicy    = models.BooleanField(default=False)
    prep_time   = models.IntegerField(default=15, help_text='Preparation time in minutes')
    calories    = models.IntegerField(null=True, blank=True)
    allergens   = models.CharField(max_length=300, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f'{self.name} — Ksh {self.price}'
