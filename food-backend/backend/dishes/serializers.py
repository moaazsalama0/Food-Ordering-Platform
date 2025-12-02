from rest_framework import serializers
from .models import Category, Dish, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class DishSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Dish
        fields = [
            'id',
            'category',
            'category_name',
            'name',
            'description',
            'price',
            'image_url',
            'is_available',
        ]
# Create your serializers here.
class ReviewSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    dish_name = serializers.CharField(source='dish.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id',
            'user', 'user_id', 'user_name',
            'dish', 'dish_name',
            'rating',
            'comment',
        ]
        read_only_fields = ['id', 'user_id', 'user_name']
