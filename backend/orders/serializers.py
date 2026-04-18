from rest_framework import serializers
from .models import Order, Review


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'car_name', 'vehicle_id', 'full_name',
            'phone', 'date', 'comment', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'car_name', 'vehicle_id', 'text', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
