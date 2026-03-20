from rest_framework.generics import ListAPIView
from ..models import Telemetry
from ..serializers.telemetrySerializer import TelemetrySerializer

class TelemetryListView(ListAPIView):
    serializer_class = TelemetrySerializer

    def get_queryset(self):
        queryset = Telemetry.objects.all().order_by("-timestamp")

        limit = self.request.query_params.get("limit")
        if limit:
            queryset = queryset[:int(limit)]

        return queryset.order_by("timestamp")