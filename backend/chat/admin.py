# Register your models here.

from django.contrib import admin
from .models import ChatRoom, ChatMessage, RoomStatus

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ("id", "room_name")
    search_fields = ("room_name",)

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "room", "sender", "timestamp")
    list_filter = ("room",)
    search_fields = ("sender", "message")

@admin.register(RoomStatus)
class RoomStatusAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "room", "last_read_at")
    list_filter = ("room", "user")
