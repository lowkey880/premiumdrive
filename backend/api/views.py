from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Vehicle, Category
from .serializers import VehicleSerializer, CategorySerializer


class VehicleListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        qs = Vehicle.objects.all()
        brand = request.query_params.get('brand')
        vehicle_type = request.query_params.get('type')
        if brand:
            qs = qs.filter(brand__icontains=brand)
        if vehicle_type:
            qs = qs.filter(type__icontains=vehicle_type)
        serializer = VehicleSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VehicleDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def _get_object(self, id):
        try:
            return Vehicle.objects.get(pk=id)
        except Vehicle.DoesNotExist:
            return None

    def get(self, request, id):
        vehicle = self._get_object(id)
        if vehicle is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(VehicleSerializer(vehicle).data)

    def put(self, request, id):
        vehicle = self._get_object(id)
        if vehicle is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = VehicleSerializer(vehicle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        vehicle = self._get_object(id)
        if vehicle is None:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
