from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=50)      
    description = models.TextField()            
    image_url = models.CharField(               
        max_length=255,
        blank=True
    )

    def __str__(self):
        return self.name
class Dish(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='dishes'
    )

    name = models.CharField(max_length=50)

    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    image_url = models.CharField(max_length=255, blank=True)

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

#  REVIEW TABLE
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    dish = models.ForeignKey(
        Dish,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )  # range 1–5
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user} → {self.dish} ({self.rating})"
# Create your models here.
