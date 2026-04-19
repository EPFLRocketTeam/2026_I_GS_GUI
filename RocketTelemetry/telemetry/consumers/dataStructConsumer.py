import json
import asyncio
from venv import logger
from channels.generic.websocket import AsyncWebsocketConsumer

class DataStructConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.selected_radio_id = None
        logger.info("DataStruct WebSocket connected")

    async def disconnect(self, close_code):
        logger.info(f"DataStruct WebSocket disconnected with code {close_code}")

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        try:
            data = json.loads(text_data)
            message_type = data.get("type")

            if message_type == "select_radio":
                self.selected_radio_id = data.get("radioId")

                await self.send(text_data=json.dumps({
                    "type": "selected_radio",
                    "radioId": self.selected_radio_id,
                }))

            elif message_type == "get_selected_radio":
                await self.send(text_data=json.dumps({
                    "type": "selected_radio",
                    "radioId": self.selected_radio_id,
                }))

        except Exception as e:
            logger.error(f"Error processing message: {e}")

