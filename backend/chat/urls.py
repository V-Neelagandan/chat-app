# backend/chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # HTML views (Django templates)
    path("", views.room_list, name="room_list"),
    path("<str:room_name>/", views.chat_room, name="chat_room"),

    # JSON APIs for React
    path("api/rooms/", views.api_rooms, name="api_rooms"),
    path("api/messages/<str:room_name>/", views.api_messages, name="api_messages"),
]
