# wsapp/consumer.py  (or wherever your consumer is)
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import ChatRoom, ChatMessage
from django.utils import timezone
from channels.db import database_sync_to_async

@database_sync_to_async
def save_message(room_name, username, message):
    room, _ = ChatRoom.objects.get_or_create(room_name=room_name)
    return ChatMessage.objects.create(
        room=room,
        sender=username,
        message=message,
    )

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group, self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")
        username = data.get("username") or data.get("sender") or "Unknown"

        # --- NEW TYPING LOGIC: Handle typing status broadcast ---
        if "typing" in data:
            await self.channel_layer.group_send(
                self.room_group,
                {
                    "type": "typing_status",
                    "username": username,
                    "typing": data["typing"], # true or false
                },
            )
            return
        # --------------------------------------------------------

        if not message:
            return

        await save_message(self.room_name, username, message)

        await self.channel_layer.group_send(
            self.room_group,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
            },
        )



        # --- NEW HANDLER: Send typing status to individual websocket ---
    async def typing_status(self, event):
        """Receives typing status from group and sends it over WebSocket"""
        await self.send(
            text_data=json.dumps(
                {
                    "type": "typing", # Use 'typing' type for frontend distinction
                    "username": event["username"],
                    "typing": event["typing"],
                }
            )
        )
    # ------------------------------------------------------------

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "username": event["username"],
                }
            )
        )
