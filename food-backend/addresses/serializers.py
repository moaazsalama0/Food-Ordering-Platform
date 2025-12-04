from rest_framework import serializers
from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id',
            'user',
            'city',
            'street',
            'building_number',
            'floor',
            'apartment_number',
        ]
        read_only_fields = ['id']