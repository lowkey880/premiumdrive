from django.db import models
from django.contrib.auth.models import User


class OrderManager(models.Manager):
    def my_orders(self, user):
        return self.get_queryset().filter(user=user)


class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('test-drive', 'Test Drive'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    car_name = models.CharField(max_length=255)
    vehicle_id = models.IntegerField(null=True, blank=True)
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    date = models.DateField(null=True, blank=True)
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    is_purchased = models.BooleanField(default=False)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    card_last4 = models.CharField(max_length=4, blank=True)
    purchased_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = OrderManager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.pk} — {self.car_name} ({self.status})"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    car_name = models.CharField(max_length=255)
    vehicle_id = models.IntegerField(null=True, blank=True)
    text = models.TextField()
    rating = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user} — {self.car_name} ({self.rating}/5)"
