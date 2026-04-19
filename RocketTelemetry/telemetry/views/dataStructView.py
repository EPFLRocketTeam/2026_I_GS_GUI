from rest_framework.generics import ListAPIView
from ..models import DataStruct
from ..serializers.dataStructSerializer import DataStructSerializer

class DataStructListView(ListAPIView):
    serializer_class = DataStructSerializer

    def get_queryset(self):
        queryset = DataStruct.objects.all().order_by("-timestamp")

        limit = self.request.query_params.get("limit")
        if limit:
            queryset = queryset[:int(limit)]

        return queryset.order_by("timestamp")