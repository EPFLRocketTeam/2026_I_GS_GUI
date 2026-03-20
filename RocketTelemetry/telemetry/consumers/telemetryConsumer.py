import asyncio
from asyncio.log import logger
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from telemetry.schemas.packetSchema import decode_packet
from ..simulators.sharedState import latest_packets

import json

class TelemetryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("CONNECT METHOD REACHED")
        await self.accept()
        print("WebSocket connected")
        self.sending_task = asyncio.create_task(self.periodic_send())

    async def disconnect(self, close_code):
        print("WebSocket disconnected")
        self.sending_task.cancel()
    
    async def periodic_send(self):
        while True:
            await self.send_telemetry_data()
            await asyncio.sleep(1)
            
    async def send_telemetry_data(self):
        try:
            raw_packet = latest_packets.get("0x01")
            if raw_packet is None:
                return  # wait until RadioConsumer has generated one            
             
            decoded = decode_packet("0x01", raw_packet)
            await self.send(json.dumps({
                "timeLabel": datetime.now().strftime("%H:%M:%S"),
                "altitude": round(decoded["altitude"]["value"], 2),
                "velocity": round(decoded["velocity"]["value"], 2),
                "temperature": round(decoded["temperature"]["value"], 2),
                "battery_voltage": round(decoded["battery_voltage"]["value"], 2),
            }))
        except Exception as e:
            logger.error(f"Error sending telemetry: {e}")