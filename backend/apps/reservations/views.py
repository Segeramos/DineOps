# backend/apps/reservations/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer, CreateReservationSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    serializer = CreateReservationSerializer(data=request.data)
    if serializer.is_valid():
        reservation = serializer.save(customer=request.user)
        return Response(ReservationSerializer(reservation).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_reservations(request):
    if request.user.is_admin:
        reservations = Reservation.objects.all().select_related('customer')
        # Filter by date
        date = request.query_params.get('date')
        if date:
            reservations = reservations.filter(date=date)
        # Filter by status
        res_status = request.query_params.get('status')
        if res_status:
            reservations = reservations.filter(status=res_status)
    else:
        reservations = Reservation.objects.filter(customer=request.user)

    return Response(ReservationSerializer(reservations, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reservation(request, pk):
    try:
        if request.user.is_admin:
            reservation = Reservation.objects.get(pk=pk)
        else:
            reservation = Reservation.objects.get(pk=pk, customer=request.user)
        return Response(ReservationSerializer(reservation).data)
    except Reservation.DoesNotExist:
        return Response({'error': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_reservation_status(request, pk):
    if not request.user.is_admin:
        return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        reservation = Reservation.objects.get(pk=pk)
        new_status = request.data.get('status')
        if new_status not in dict(Reservation.STATUS_CHOICES):
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        reservation.status = new_status
        reservation.confirmed_by = request.user
        reservation.save()
        return Response(ReservationSerializer(reservation).data)
    except Reservation.DoesNotExist:
        return Response({'error': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, pk):
    try:
        if request.user.is_admin:
            reservation = Reservation.objects.get(pk=pk)
        else:
            reservation = Reservation.objects.get(pk=pk, customer=request.user)
        reservation.status = Reservation.STATUS_CANCELLED
        reservation.save()
        return Response({'message': 'Reservation cancelled.'})
    except Reservation.DoesNotExist:
        return Response({'error': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)
