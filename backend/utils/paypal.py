# backend/utils/paypal.py
import requests
import base64
from django.conf import settings


def get_access_token():
    url = "https://api-m.sandbox.paypal.com/v1/oauth2/token" \
          if settings.PAYPAL_MODE == "sandbox" else \
          "https://api-m.paypal.com/v1/oauth2/token"

    credentials = base64.b64encode(
        f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}".encode()
    ).decode()

    response = requests.post(
        url,
        data={"grant_type": "client_credentials"},
        headers={"Authorization": f"Basic {credentials}"}
    )
    return response.json().get("access_token")


def create_order(amount, currency="USD", order_ref=""):
    """Create a PayPal order."""
    token = get_access_token()
    url   = "https://api-m.sandbox.paypal.com/v2/checkout/orders" \
            if settings.PAYPAL_MODE == "sandbox" else \
            "https://api-m.paypal.com/v2/checkout/orders"

    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": str(order_ref),
            "amount": {
                "currency_code": currency,
                "value": f"{float(amount):.2f}"
            }
        }]
    }

    response = requests.post(
        url, json=payload,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    )
    return response.json()


def capture_order(paypal_order_id):
    """Capture (complete) a PayPal order after customer approval."""
    token = get_access_token()
    url   = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}/capture" \
            if settings.PAYPAL_MODE == "sandbox" else \
            f"https://api-m.paypal.com/v2/checkout/orders/{paypal_order_id}/capture"

    response = requests.post(
        url,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    )
    return response.json()
