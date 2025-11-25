from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='user-register'),
    path('login/', views.login, name='user-login'),
    path('<int:pk>/', views.user_detail, name='user-detail'),
]
