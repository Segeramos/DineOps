# backend/apps/orders/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('',                          views.list_orders,         name='list-orders'),
    path('create/',                   views.create_order,        name='create-order'),
    path('<int:order_id>/',           views.get_order,           name='get-order'),
    path('<int:order_id>/status/',    views.update_order_status, name='update-order-status'),
    path('<int:order_id>/tip/',       views.add_tip,             name='add-tip'),
]
