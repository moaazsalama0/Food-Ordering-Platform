from rest_framework import serializers
from .models import Category, Dish, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'category_name', 'category_description', 'image_url']

class DishSerializer(serializers.ModelSerializer):
    # These are computed fields for frontend
    id = serializers.IntegerField(source='dish_id', read_only=True)
    name = serializers.CharField(source='dish_name', read_only=True)
    description = serializers.CharField(source='dish_description', read_only=True)
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    
    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'description', 'price', 'img', 'is_available',
            'category_id', 'category_name', 'dish_id', 'dish_name', 'dish_description'
        ]
        read_only_fields = ['id', 'name', 'description', 'category_name']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    dish_name = serializers.CharField(source='dish.dish_name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'review_id', 'user_id', 'user_name', 'dish_id', 'dish_name',
            'rating', 'comments', 'created_at'
        ]
        read_only_fields = ['review_id', 'user_name', 'dish_name', 'created_at']