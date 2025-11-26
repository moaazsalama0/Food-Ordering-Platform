from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'phone', 'role')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    list_filter = ('role',)

# Register your models here.
