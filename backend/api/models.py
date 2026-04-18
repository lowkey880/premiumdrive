from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=100)
    image = models.URLField()
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles'
    )
    year = models.IntegerField(default=2024)
    description = models.TextField(blank=True)
    engine = models.CharField(max_length=100, blank=True)
    horsepower = models.IntegerField(default=0)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.brand} {self.name} ({self.year})"
