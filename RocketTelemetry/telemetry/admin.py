from django.contrib import admin
from .models import Telemetry

@admin.register(Telemetry)
class TelemetryAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "altitude", "velocity", "temperature", "battery_voltage")
    ordering = ("timestamp",)