# backend/apps/reservations/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('',                       views.list_reservations,        name='list-reservations'),
    path('create/',                views.create_reservation,       name='create-reservation'),
    path('<int:pk>/',              views.get_reservation,          name='get-reservation'),
    path('<int:pk>/status/',       views.update_reservation_status,name='update-reservation-status'),
    path('<int:pk>/cancel/',       views.cancel_reservation,       name='cancel-reservation'),
]
