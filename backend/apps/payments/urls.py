# backend/apps/payments/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('initiate/',                    views.initiate_payment,    name='initiate-payment'),
    path('mpesa/callback/',              views.mpesa_callback,      name='mpesa-callback'),
    path('paypal/capture/',              views.paypal_capture,      name='paypal-capture'),
    path('stripe/webhook/',             views.stripe_webhook,      name='stripe-webhook'),
    path('cash/<int:payment_id>/confirm/', views.confirm_cash_payment, name='confirm-cash'),
    path('<int:payment_id>/status/',     views.payment_status,      name='payment-status'),
]
