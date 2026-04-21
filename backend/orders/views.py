from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import Order, Review
from .serializers import OrderSerializer, ReviewSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.my_orders(self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated]

    CANCELLABLE_STATUSES = {'new', 'pending'}

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'detail': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status not in self.CANCELLABLE_STATUSES:
            return Response(
                {'detail': f'Cannot cancel an order with status "{order.status}".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = 'cancelled'
        order.save(update_fields=['status'])
        return Response(OrderSerializer(order).data)


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Review.objects.all()
        vehicle_id = self.request.query_params.get('vehicle')
        if vehicle_id:
            qs = qs.filter(vehicle_id=vehicle_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


VALID_PROMO_CODES = {
    'KBTU': 20,
}


class PurchaseVehicleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):
        card_number = str(request.data.get('card_number', ''))
        vehicle_id = request.data.get('vehicle_id')
        car_name = request.data.get('car_name', '')
        purchase_price = request.data.get('purchase_price')
        promo_code = str(request.data.get('promo_code', '')).upper()

        if len(card_number) != 12:
            return Response(
                {'error': 'Номер карты должен содержать 12 цифр'},
                status=400
            )

        if promo_code and promo_code not in VALID_PROMO_CODES:
            return Response(
                {'error': 'Неверный промокод'},
                status=400
            )

        order = Order.objects.create(
            user=request.user,
            car_name=car_name,
            vehicle_id=vehicle_id,
            is_purchased=True,
            purchase_price=purchase_price,
            card_last4=card_number[-4:],
            status='completed',
            purchased_at=timezone.now()
        )

        return Response({
            'success': True,
            'message': 'Покупка успешна!',
            'card_last4': card_number[-4:],
            'order_id': order.id
        })
