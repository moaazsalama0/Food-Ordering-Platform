from rest_framework import viewsets, permissions
from .models import Category, Dish, Review
from .serializers import CategorySerializer, DishSerializer, ReviewSerializer

# 🔹 CATEGORY VIEWSET
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]  
# 🔹 DISH VIEWSET
class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all().order_by('id')
    serializer_class = DishSerializer
    permission_classes = [permissions.AllowAny]
# 🔹 REVIEW VIEWSET
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.select_related('user', 'dish')
        dish_id = self.request.query_params.get('dish')
        if dish_id:
            qs = qs.filter(dish_id=dish_id)  
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Create your views here.
