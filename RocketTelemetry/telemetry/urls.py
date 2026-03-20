from django.urls import path
from django.contrib import admin
from .views.defaultView import DefaultView
from .views.telemetryViews import TelemetryListView
from .views.radioViews import RadioConfigListView

urlpatterns = [
    path("telemetry/", TelemetryListView.as_view(), name="telemetry-list"),
    path("radio/", RadioConfigListView.as_view(), name="radio-list"),
    path("", DefaultView.as_view(), name="default-view"),
    path("admin/", admin.site.urls),
]