# backend/utils/mpesa.py
import requests
import base64
from datetime import datetime
from django.conf import settings


def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" \
          if settings.MPESA_ENV == "sandbox" else \
          "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    credentials = base64.b64encode(
        f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}".encode()
    ).decode()

    response = requests.get(url, headers={"Authorization": f"Basic {credentials}"})
    return response.json().get("access_token")


def generate_password():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp


def stk_push(phone, amount, order_ref):
    """Initiate STK Push to customer phone."""
    token    = get_access_token()
    password, timestamp = generate_password()

    # Format phone — ensure it starts with 254
    phone = str(phone).strip().replace("+", "").replace(" ", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]

    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" \
          if settings.MPESA_ENV == "sandbox" else \
          "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password":          password,
        "Timestamp":         timestamp,
        "TransactionType":   "CustomerPayBillOnline",
        "Amount":            int(amount),
        "PartyA":            phone,
        "PartyB":            settings.MPESA_SHORTCODE,
        "PhoneNumber":       phone,
        "CallBackURL":       settings.MPESA_CALLBACK_URL,
        "AccountReference":  str(order_ref)[:12],
        "TransactionDesc":   "DineOps Payment",
    }

    response = requests.post(
        url,
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.json()
