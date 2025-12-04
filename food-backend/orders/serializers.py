from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from .models import Cart, CartItem, Order, OrderItem, Payment ,StatusUpdate


# 🔹 CART ITEM SERIALIZER
class CartItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)      

    class Meta:
        model = CartItem
        fields = ['id', 'dish', 'dish_name', 'quantity']
        read_only_fields = ['id']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'updated_at', 'items']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

# 🔹 ORDER ITEM SERIALIZER
class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'dish', 'dish_name', 'quantity', 'subtotal']
        read_only_fields = ['id', 'subtotal']


# 🔹 ORDER SERIALIZER
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'address', 'placed_at', 'estimated_delivery',
            'subtotal', 'delivery_fee', 'total_amount', 'items'
        ]
        read_only_fields = ['id', 'user', 'placed_at']


# 🔹 PAYMENT SERIALIZER
class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id',
            'order',
            'order_id',
            'amount',
            'method',
            'status',
            'transaction_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'order_id', 'created_at', 'updated_at']

# 🔹 STATUS UPDATE SERIALIZE
class StatusUpdateSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)

    class Meta:
        model = StatusUpdate
        fields = [
            'id',
            'order',
            'order_id',
            'status',
            'time',
        ]
        read_only_fields = ['id', 'order_id', 'time']

