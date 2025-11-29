from django.shortcuts import render, redirect

# login required
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import timedelta
from accounts.models import Profile
# Import ChatRoom,ChatMessage
from .models import ChatMessage, ChatRoom, RoomStatus

# for API
from django.http import JsonResponse
# import json
from django.views.decorators.http import require_GET
# from django.views.decorators.csrf import csrf_exempt
# import re


# Create your views here.

@login_required
def room_list(request):
    # Create room on POST
    if request.method == "POST":
        name = request.POST.get("room_name", "").strip()
        if name:
            room, _ = ChatRoom.objects.get_or_create(room_name=name)
            RoomStatus.objects.get_or_create(user=request.user, room=room)
            return redirect("chat_room", room_name=room.room_name)

    rooms = ChatRoom.objects.all().order_by("room_name")

    room_data = []
    for room in rooms:
        # last message in this room
        last_msg = (
            ChatMessage.objects.filter(room=room)
            .order_by("-timestamp")
            .first()
        )

        # ensure RoomStatus exists
        status, _ = RoomStatus.objects.get_or_create(
            user=request.user, room=room
        )

        # unread = messages newer than last_read_at
        unread = ChatMessage.objects.filter(
            room=room,
            timestamp__gt=status.last_read_at
        ).count()

        room_data.append(
            {
                "room": room,
                "last_message": last_msg,
                "unread": unread,
            }
        )

    return render(request, "chat/room_list.html", {"room_data": room_data})


@login_required
def chat_room(request, room_name):
    room, _ = ChatRoom.objects.get_or_create(room_name=room_name)
    messages = ChatMessage.objects.filter(room=room)

    # Mark messages as read
    from django.utils import timezone
    status, _ = RoomStatus.objects.get_or_create(
        user=request.user,
        room=room
    )
    status.last_read_at = timezone.now()
    status.save()

    now = timezone.now()
    online_profiles = Profile.objects.filter(
        last_seen__gte=now - timedelta(minutes=2))
    online_usernames = [p.user.username for p in online_profiles]

    return render(request, "chat_room.html", {
        "room_name": room_name,
        "messages": messages,
        "online_users": online_usernames,
    })

# API FOR FROONTEND


def api_rooms(request):
    rooms = []

    for r in ChatRoom.objects.all():
        last_msg = ChatMessage.objects.filter(
            room=r).order_by("-timestamp").first()

        rooms.append({
            "name": r.room_name,
            "last_message": last_msg.message if last_msg else "",
            "last_sender": last_msg.sender if last_msg else "",
            "unread": 0,  # We will calculate later
        })

    return JsonResponse({"rooms": rooms})


@require_GET
def api_messages(request, room_name):
    """
    Return all messages for a given room as JSON
    """
    try:
        room = ChatRoom.objects.get(room_name=room_name)
    except ChatRoom.DoesNotExist:
        return JsonResponse({"messages": []})

    msgs = (
        ChatMessage.objects.filter(room=room)
        .order_by("timestamp")
        .values("id", "sender", "message", "timestamp")
    )

    # convert QuerySet to list for JSON
    messages_list = list(msgs)

    return JsonResponse({"messages": messages_list})
