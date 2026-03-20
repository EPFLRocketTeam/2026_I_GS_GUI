from rest_framework.generics import ListAPIView
from ..models import RadioConfig
from ..serializers.radioSerializer import RadioConfigSerializer

class RadioConfigListView(ListAPIView):
    serializer_class = RadioConfigSerializer

    def get_queryset(self):
        queryset = RadioConfig.objects.all().order_by("-timestamp")

        limit = self.request.query_params.get("limit")
        if limit:
            queryset = queryset[:int(limit)]

        return queryset.order_by("timestamp")