import json
import asyncio
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from ..simulators.packetSimulator import generate_fake_packet, packet_to_hex
from ..schemas.packetSchema import decode_packet, PACKET_SCHEMA
from ..simulators.sharedState import latest_packets

import logging

logger = logging.getLogger(__name__)

class RadioConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        logger.info("Radio WebSocket connected")
        self.sending_task = asyncio.create_task(self.periodic_send()) 

    async def disconnect(self, close_code):
        logger.info(f"Radio WebSocket disconnected with code {close_code}")
        if hasattr(self, 'sending_task'):
            self.sending_task.cancel()

    async def receive(self, text_data):
        # Handle any messages from frontend
        try:
            data = json.loads(text_data)
            logger.info(f"Received message: {data}")
            # Send data in response to messages too
            await self.send_radio_data()
        except Exception as e:
            logger.error(f"Error processing message: {e}")

    async def send_radio_data(self):
        """Send simulated radio data to frontend."""
        try:
            radios_data = []
            for radio_id in PACKET_SCHEMA:
                # Simulate receiving hex data
                raw_packet = generate_fake_packet(radio_id)
                latest_packets[radio_id] = raw_packet
                hex_data = packet_to_hex(raw_packet)
                
                # Decode the packet
                decoded = decode_packet(radio_id, raw_packet)
                
                # Format for frontend
                pins = []
                for field_name, field_data in decoded.items():
                    pin_type = self.get_type_from_format(PACKET_SCHEMA[radio_id]["fields"], field_name)
                    pins.append({
                        "key": field_name,
                        "label": field_name.replace("_", " ").title(),
                        "unit": field_data["unit"],
                        "value": str(field_data["value"]),
                        "type": pin_type
                    })
                
                radios_data.append({
                    "uid": int(radio_id, 16),  # Convert hex to int for uid
                    "idVal": radio_id,
                    "status": "online",
                    "pins": pins,
                    "hex_data": hex_data,  # Include hex for debugging
                })
            
            response = {
                "status": "ok",
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "received": radios_data,
            }
            await self.send(text_data=json.dumps(response))
            logger.debug("Sent simulated radio data")
            
        except Exception as e:
            logger.error(f"Error sending radio data: {e}", exc_info=True)
            # Send error message
            error_response = {
                "status": "error",
                "message": str(e),
            }
            await self.send(text_data=json.dumps(error_response))

    async def periodic_send(self):
        """Send data immediately and then periodically."""
        await self.send_radio_data()  # Send immediately

    def get_type_from_format(self, fields, field_name):
        """Get the data type string from the format character."""
        type_map = {
            'f': 'FLOAT',
            'h': 'SHORT',
            'i': 'INT',
            'l': 'LONG',
            'H': 'UNSIGNED_SHORT',
            'I': 'UNSIGNED_INT',
            'B': 'BYTE',
        }
        for name, fmt_char, _ in fields:
            if name == field_name:
                if fmt_char.endswith('s'):
                    return f'STRING({fmt_char[:-1]})'
                return type_map.get(fmt_char, 'UNKNOWN')
        return 'UNKNOWN'