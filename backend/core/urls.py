# # backend/core/urls.py
# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("chat/", include("chat.urls")),        # gives /chat/... and /chat/api/...
#     path("accounts/", include("accounts.urls")),
# ]


# backend/core/urls.py
from django.contrib import admin
from django.urls import path, include
from chat.views import (
    room_list,
    chat_room,
    api_rooms,
    api_messages,
    api_create_room,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Django HTML pages
    path("", room_list, name="room_list"),                 # 127.0.0.1:9000/
    path("chat/<str:room_name>/", chat_room, name="chat_room"),

    # JSON APIs for React
    path("chat/api/rooms/", api_rooms, name="api_rooms"),
    path("chat/api/messages/<str:room_name>/", api_messages, name="api_messages"),

    # NEW: API to create a room
    path("chat/api/rooms/create/", api_create_room, name="api_create_room"), # <-- NEW PATH
    
    # Auth (HTML + API)
    path("accounts/", include("accounts.urls")),
]
