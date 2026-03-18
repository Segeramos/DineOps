# backend/apps/orders/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from apps.menu.models import MenuItem


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    # Create order
    order = Order.objects.create(
        customer     = request.user,
        order_type   = data['order_type'],
        table_number = data.get('table_number', ''),
        notes        = data.get('notes', ''),
    )

    # Create order items
    for item_data in data['items']:
        try:
            menu_item = MenuItem.objects.get(pk=item_data['menu_item_id'], is_available=True)
        except MenuItem.DoesNotExist:
            order.delete()
            return Response(
                {'error': f"Menu item {item_data['menu_item_id']} not found or unavailable."},
                status=status.HTTP_400_BAD_REQUEST
            )
        OrderItem.objects.create(
            order     = order,
            menu_item = menu_item,
            name      = menu_item.name,
            price     = menu_item.price,
            quantity  = item_data['quantity'],
            notes     = item_data.get('notes', ''),
        )

    # Calculate totals
    order.calculate_total()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    if request.user.is_admin:
        orders = Order.objects.all().select_related('customer').prefetch_related('items')
    else:
        orders = Order.objects.filter(customer=request.user).prefetch_related('items')

    status_filter = request.query_params.get('status')
    if status_filter:
        orders = orders.filter(status=status_filter)

    return Response(OrderSerializer(orders, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, order_id):
    try:
        if request.user.is_admin:
            order = Order.objects.get(id=order_id)
        else:
            order = Order.objects.get(id=order_id, customer=request.user)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def add_tip(request, order_id):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        order = Order.objects.get(id=order_id)
        tip = request.data.get('tip', 0)
        order.tip = tip
        order.calculate_total()
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
