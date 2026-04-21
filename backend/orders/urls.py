from django.urls import path
from .views import OrderListCreateView, OrderCancelView, ReviewListCreateView, PurchaseVehicleView

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderCancelView.as_view(), name='order-cancel'),
    path('orders/purchase/', PurchaseVehicleView.as_view(), name='purchase'),
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
]
