from django.db import models

# Create your models here.

class Telemetry(models.Model):
    timestamp = models.DateTimeField()
    altitude = models.FloatField()
    velocity = models.FloatField()
    temperature = models.FloatField()
    battery_voltage = models.FloatField()

    def __str__(self):
        return f"Telemetry @ {self.timestamp}"
    
class RadioConfig(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    radio_id = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    p1 = models.CharField(max_length=50)
    p2 = models.CharField(max_length=50)
    p3 = models.CharField(max_length=50)

    def __str__(self):
        return f"RadioConfig {self.radio_id} @ {self.timestamp}"
    
class DataStruct(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    radio_id = models.CharField(max_length=20)

    def __str__(self):
        return f"DataStruct {self.radio_id} @ {self.timestamp}"
    