from django.urls import path
from .views import VehicleListView, VehicleDetailView, CategoryListCreateView

urlpatterns = [
    path('vehicles/', VehicleListView.as_view(), name='vehicle-list'),
    path('vehicles/<int:id>/', VehicleDetailView.as_view(), name='vehicle-detail'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
]
