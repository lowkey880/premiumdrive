from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Review.objects.all()
        vehicle_id = self.request.query_params.get('vehicle')
        if vehicle_id:
            qs = qs.filter(vehicle_id=vehicle_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
