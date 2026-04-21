from rest_framework import serializers
from .models import Order, Review


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'car_name', 'vehicle_id', 'full_name',
            'phone', 'date', 'comment', 'status',
            'is_purchased', 'purchase_price', 'card_last4',
            'purchased_at', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'is_purchased', 'purchase_price',
                            'card_last4', 'purchased_at', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'car_name', 'vehicle_id', 'text', 'rating', 'created_at', 'username']
        read_only_fields = ['id', 'created_at', 'username']

    def get_username(self, obj):
        return obj.user.username if obj.user else 'Аноним'

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
