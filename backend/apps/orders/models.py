# backend/apps/orders/models.py
from django.db import models
from apps.accounts.models import User
from apps.menu.models import MenuItem
import uuid


class Order(models.Model):

    STATUS_PENDING    = 'pending'
    STATUS_CONFIRMED  = 'confirmed'
    STATUS_PREPARING  = 'preparing'
    STATUS_READY      = 'ready'
    STATUS_DELIVERED  = 'delivered'
    STATUS_CANCELLED  = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING,   'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_PREPARING, 'Preparing'),
        (STATUS_READY,     'Ready'),
        (STATUS_DELIVERED, 'Delivered'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    TYPE_DINE_IN   = 'dine_in'
    TYPE_TAKEAWAY  = 'takeaway'
    TYPE_DELIVERY  = 'delivery'

    ORDER_TYPES = [
        (TYPE_DINE_IN,  'Dine In'),
        (TYPE_TAKEAWAY, 'Takeaway'),
        (TYPE_DELIVERY, 'Delivery'),
    ]

    order_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    customer     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    order_type   = models.CharField(max_length=20, choices=ORDER_TYPES, default=TYPE_DINE_IN)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    table_number = models.CharField(max_length=10, blank=True)
    subtotal     = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tip          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes        = models.TextField(blank=True)
    served_by    = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='served_orders'
    )
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{str(self.order_number)[:8]} — {self.status}'

    def calculate_total(self):
        self.subtotal = sum(item.subtotal for item in self.items.all())
        self.tax      = self.subtotal * 0.16   # 16% VAT Kenya
        self.total    = self.subtotal + self.tax + self.tip
        self.save()


class OrderItem(models.Model):
    order       = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item   = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    name        = models.CharField(max_length=200)  # snapshot at time of order
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    quantity    = models.IntegerField(default=1)
    subtotal    = models.DecimalField(max_digits=10, decimal_places=2)
    notes       = models.CharField(max_length=300, blank=True)

    def save(self, *args, **kwargs):
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.quantity}x {self.name}'