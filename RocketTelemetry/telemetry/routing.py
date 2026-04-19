from django.urls import re_path
from telemetry.consumers.telemetryConsumer import TelemetryConsumer
from telemetry.consumers.radioConsumer import RadioConsumer
from telemetry.consumers.dataStructConsumer import DataStructConsumer

websocket_urlpatterns = [
    re_path(r"^ws/telemetry/$", TelemetryConsumer.as_asgi()),
    re_path(r"^ws/radio/$", RadioConsumer.as_asgi()),
    re_path(r"^ws/dataStruct/$", DataStructConsumer.as_asgi()),
]