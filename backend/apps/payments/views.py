# backend/apps/payments/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from .models import Payment
from apps.orders.models import Order
from apps.accounting.models import Transaction
import stripe
import json


# ── Initiate Payment ──────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    order_id = request.data.get('order_id')
    method   = request.data.get('method')
    phone    = request.data.get('phone', '')

    try:
        order = Order.objects.get(id=order_id, customer=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check no existing successful payment
    if hasattr(order, 'payment') and order.payment.status == 'success':
        return Response({'error': 'Order already paid.'}, status=status.HTTP_400_BAD_REQUEST)

    payment, _ = Payment.objects.get_or_create(
        order    = order,
        defaults = {'customer': request.user, 'method': method, 'amount': order.total}
    )
    payment.method = method
    payment.amount = order.total
    payment.status = Payment.STATUS_PENDING
    payment.save()

    # ── Mpesa ──────────────────────────────────────────────────────
    if method == 'mpesa':
        if not phone:
            return Response({'error': 'Phone number required for Mpesa.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from utils.mpesa import stk_push
            result = stk_push(phone, order.total, str(order.order_number))
            if result.get('ResponseCode') == '0':
                return Response({
                    'message': 'STK push sent. Enter your Mpesa PIN to complete payment.',
                    'checkout_request_id': result.get('CheckoutRequestID'),
                    'payment_id': payment.id,
                })
            return Response({'error': result.get('errorMessage', 'Mpesa request failed.')}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ── Stripe ─────────────────────────────────────────────────────
    elif method == 'card':
        try:
            from utils.stripe_pay import create_payment_intent
            intent = create_payment_intent(
                amount   = order.total,
                metadata = {'order_id': str(order.id), 'order_number': str(order.order_number)}
            )
            payment.stripe_payment_id = intent['id']
            payment.save()
            return Response({
                'client_secret': intent['client_secret'],
                'payment_id':    payment.id,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ── PayPal ─────────────────────────────────────────────────────
    elif method == 'paypal':
        try:
            from utils.paypal import create_order as paypal_create
            result = paypal_create(order.total, order_ref=order.order_number)
            paypal_order_id = result.get('id')
            if paypal_order_id:
                payment.paypal_order_id = paypal_order_id
                payment.save()
                approval_url = next(
                    (link['href'] for link in result.get('links', []) if link['rel'] == 'approve'),
                    None
                )
                return Response({'approval_url': approval_url, 'paypal_order_id': paypal_order_id, 'payment_id': payment.id})
            return Response({'error': 'PayPal order creation failed.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ── Cash ───────────────────────────────────────────────────────
    elif method == 'cash':
        payment.status = Payment.STATUS_PENDING
        payment.save()
        return Response({
            'message': 'Cash payment recorded. Please pay at the counter.',
            'payment_id': payment.id,
        })

    return Response({'error': 'Invalid payment method.'}, status=status.HTTP_400_BAD_REQUEST)


# ── Mpesa Callback ────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    data     = request.data
    body     = data.get('Body', {})
    stk      = body.get('stkCallback', {})
    result_code = stk.get('ResultCode')

    if result_code == 0:
        items = {i['Name']: i['Value'] for i in stk.get('CallbackMetadata', {}).get('Item', [])}
        mpesa_ref    = items.get('MpesaReceiptNumber', '')
        amount       = items.get('Amount', 0)
        phone        = items.get('PhoneNumber', '')
        checkout_id  = stk.get('CheckoutRequestID', '')

        # Find payment by matching amount and pending status
        try:
            payment = Payment.objects.filter(
                method=Payment.METHOD_MPESA,
                status=Payment.STATUS_PENDING,
                amount=amount
            ).latest('id')
            payment.status        = Payment.STATUS_SUCCESS
            payment.mpesa_ref     = checkout_id
            payment.mpesa_receipt = mpesa_ref
            payment.save()

            # Confirm order
            payment.order.status = 'confirmed'
            payment.order.save()

            # Record transaction
            Transaction.objects.create(
                payment     = payment,
                type        = Transaction.TYPE_SALE,
                amount      = payment.amount,
                tip_amount  = payment.tip,
                tax_amount  = payment.order.tax,
                description = f"Mpesa payment — {mpesa_ref}",
                recorded_by = payment.customer,
            )
        except Payment.DoesNotExist:
            pass

    return Response({'ResultCode': 0, 'ResultDesc': 'Success'})


# ── PayPal Capture ────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def paypal_capture(request):
    paypal_order_id = request.data.get('paypal_order_id')
    try:
        from utils.paypal import capture_order
        result = capture_order(paypal_order_id)
        if result.get('status') == 'COMPLETED':
            payment = Payment.objects.get(paypal_order_id=paypal_order_id)
            payment.status = Payment.STATUS_SUCCESS
            payment.save()
            payment.order.status = 'confirmed'
            payment.order.save()
            Transaction.objects.create(
                payment=payment, type=Transaction.TYPE_SALE,
                amount=payment.amount, tax_amount=payment.order.tax,
                description=f"PayPal — {paypal_order_id}",
                recorded_by=payment.customer,
            )
            return Response({'message': 'Payment successful!', 'status': 'success'})
        return Response({'error': 'PayPal capture failed.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ── Stripe Webhook ────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload    = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    try:
        from utils.stripe_pay import handle_webhook
        event = handle_webhook(payload, sig_header)
        if event['type'] == 'payment_intent.succeeded':
            intent     = event['data']['object']
            payment_id = intent['metadata'].get('order_id')
            try:
                payment = Payment.objects.get(stripe_payment_id=intent['id'])
                payment.status = Payment.STATUS_SUCCESS
                payment.save()
                payment.order.status = 'confirmed'
                payment.order.save()
                Transaction.objects.create(
                    payment=payment, type=Transaction.TYPE_SALE,
                    amount=payment.amount, tax_amount=payment.order.tax,
                    description=f"Stripe — {intent['id']}",
                    recorded_by=payment.customer,
                )
            except Payment.DoesNotExist:
                pass
        return Response({'status': 'ok'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ── Confirm Cash Payment (admin) ──────────────────────────────────
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def confirm_cash_payment(request, payment_id):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        payment = Payment.objects.get(id=payment_id, method=Payment.METHOD_CASH)
        payment.status           = Payment.STATUS_SUCCESS
        payment.cash_received_by = request.user
        payment.tip              = request.data.get('tip', 0)
        payment.save()
        payment.order.status = 'confirmed'
        payment.order.save()
        Transaction.objects.create(
            payment=payment, type=Transaction.TYPE_SALE,
            amount=payment.amount, tip_amount=payment.tip,
            tax_amount=payment.order.tax,
            description="Cash payment confirmed",
            recorded_by=request.user,
        )
        return Response({'message': 'Cash payment confirmed.'})
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)


# ── Get Payment Status ────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id)
        return Response({
            'id':     payment.id,
            'method': payment.method,
            'status': payment.status,
            'amount': payment.amount,
        })
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
