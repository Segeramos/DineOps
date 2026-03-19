# backend/utils/stripe_pay.py
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_payment_intent(amount, currency="kes", metadata=None):
    """Create a Stripe PaymentIntent."""
    intent = stripe.PaymentIntent.create(
        amount=int(float(amount) * 100),  # Stripe uses cents
        currency=currency,
        metadata=metadata or {},
        automatic_payment_methods={"enabled": True},
    )
    return intent


def confirm_payment_intent(payment_intent_id):
    """Retrieve and confirm a PaymentIntent status."""
    intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    return intent


def handle_webhook(payload, sig_header):
    """Verify and parse Stripe webhook."""
    event = stripe.Webhook.construct_event(
        payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
    )
    return event
