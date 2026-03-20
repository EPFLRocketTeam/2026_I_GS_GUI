from django.core.management.base import BaseCommand
from telemetry.simulators.packetSimulator import generate_fake_packet
from telemetry.schemas.packetSchema import decode_packet, PACKET_SCHEMA
import time

class Command(BaseCommand):
    help = "Simulate radio packets being received and decoded"

    def handle(self, *args, **options):
        while True:
            for radio_id in PACKET_SCHEMA:
                raw = generate_fake_packet(radio_id)
                decoded = decode_packet(radio_id, raw)
                self.stdout.write(f"\n📡 Radio {radio_id} → {decoded}")
            time.sleep(1)