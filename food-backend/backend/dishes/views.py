from rest_framework import viewsets, permissions
from .models import Category, Dish
from .serializers import CategorySerializer, DishSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]  
class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all().order_by('id')
    serializer_class = DishSerializer
    permission_classes = [permissions.AllowAny]
# Create your views here.
