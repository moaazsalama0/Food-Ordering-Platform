from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)  # علشان يرجع اسم الطبق كمان

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