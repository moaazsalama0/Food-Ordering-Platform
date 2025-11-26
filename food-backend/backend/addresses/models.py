from django.db import models
from users.models import User

'''
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=200)
    building_number = models.CharField(max_length=20)
    floor = models.CharField(max_length=10)
    apartment_number = models.CharField(max_length=10)

    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.user.email} - {self.city}, {self.street}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        '''
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=200)
    building_number = models.CharField(max_length=20)
    floor = models.CharField(max_length=10)
    apartment_number = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Addresses"
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.city}, {self.street}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)