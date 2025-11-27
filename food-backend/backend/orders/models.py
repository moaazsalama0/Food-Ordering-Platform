from django.db import models
from django.contrib.auth import get_user_model
from dishes.models import Dish 

User = get_user_model()


class Cart(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='carts'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart #{self.id} for {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    dish = models.ForeignKey(
        Dish,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'dish')  # طبقًا للـ schema: composite PK (cart + dish)

    def __str__(self):
        return f"{self.dish} x {self.quantity} (Cart {self.cart_id})"