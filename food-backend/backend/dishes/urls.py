from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, DishViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'dishes', DishViewSet, basename='dish')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
