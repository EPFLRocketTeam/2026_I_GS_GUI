from rest_framework.views import APIView
from rest_framework.response import Response

class DefaultView(APIView):
    def get(self, request):
        return Response({"message": "Hello Icarius. Telemetry API is running."})