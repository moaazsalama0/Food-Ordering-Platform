from django.db import models
from django.contrib.auth import get_user_model

from dishes.models import Dish
from addresses.models import Address

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
class Order(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name='orders'
    )
    placed_at = models.DateTimeField(auto_now_add=True)  
    estimated_delivery = models.DateTimeField()

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.id} for {self.user}"


# 🔹 ORDER ITEM TABLE
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    dish = models.ForeignKey(
        Dish,
        on_delete=models.PROTECT,
        related_name='order_items'
    )
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('order', 'dish')  

    def __str__(self):
        return f"{self.dish} x {self.quantity} (Order {self.order_id})"
    
# 🔹 PAYMENT TABLE
    
class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        CASH = 'CASH', 'Cash'
        CARD = 'CARD', 'Card'
        WALLET = 'WALLET', 'Wallet'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    order = models.OneToOneField(   
        Order,
        on_delete=models.CASCADE,
        related_name='payment'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(
        max_length=10,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH
    )
    status = models.CharField(
        max_length=10,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    transaction_id = models.CharField(
        max_length=100,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Order #{self.order_id} - {self.status}"
    
# 🔹 STATUS UPDATE TABLE

class StatusUpdate(models.Model):

    class OrderStatus(models.TextChoices):
        READY = 'ready', 'Ready'
        ON_THE_WAY = 'on the way', 'On the Way'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_updates'
    )

    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices
    )

    time = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"Order #{self.order_id} → {self.status}"
