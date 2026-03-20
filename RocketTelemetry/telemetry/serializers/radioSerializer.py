from rest_framework import serializers
from ..models import RadioConfig

class RadioConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadioConfig
        fields = "__all__"