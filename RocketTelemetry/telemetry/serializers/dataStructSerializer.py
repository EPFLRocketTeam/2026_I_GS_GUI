from rest_framework import serializers
from ..models import DataStruct

class DataStructSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataStruct
        fields = "__all__"