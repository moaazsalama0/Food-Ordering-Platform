from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from .models import Cart, CartItem, Order, OrderItem , Payment , StatusUpdate
from .serializers import (
    CartSerializer, CartItemSerializer,
    OrderSerializer, OrderItemSerializer,
    PaymentSerializer, StatusUpdateSerializer,
)
from dishes.models import Dish
# 🔹 CART VIEWSET



class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user).prefetch_related('items__dish')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user).select_related('dish', 'cart')

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)

        dish = serializer.validated_data['dish']
        quantity = serializer.validated_data.get('quantity', 1)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            dish=dish,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        self._created_item = cart_item

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        out_serializer = self.get_serializer(self._created_item)
        headers = self.get_success_headers(out_serializer.data)
        return Response(out_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

# 🔹 ORDER VIEWSET
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__dish')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 🔹 ORDER ITEM VIEWSET
class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user).select_related('order', 'dish')

    def perform_create(self, serializer):
        dish = serializer.validated_data['dish']
        quantity = serializer.validated_data.get('quantity', 1)
        subtotal = dish.price * quantity
        serializer.save(subtotal=subtotal)

# 🔹 PAYMENT VIEWSET
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user).select_related('order')

    def perform_create(self, serializer):
        order = serializer.validated_data['order']
        if order.user != self.request.user:
            raise PermissionError("You cannot pay for another user's order.")


        serializer.save()
# 🔹 STATUS UPDATE VIEWSET
class StatusUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = StatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StatusUpdate.objects.filter(
            order__user=self.request.user
        ).order_by('-time')

    def perform_create(self, serializer):
        order = serializer.validated_data['order']

        if order.user != self.request.user:
            raise PermissionError("You cannot update another user's order status.")

        serializer.save()
