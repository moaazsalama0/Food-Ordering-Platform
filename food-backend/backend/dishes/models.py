from django.db import models

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

# Create your models here.
