# backend/accounts/api_views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User



@csrf_exempt
def api_register(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
      data = json.loads(request.body.decode())
    except Exception:
      return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return JsonResponse({"detail": "Username and password required"}, status=400)
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({"detail": "Username already taken"}, status=409)

    try:
        # 1. Create the user
        user = User.objects.create_user(username=username, password=password)
        
        # 2. Log the user in immediately
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"username": user.username}, status=201)
        else:
            return JsonResponse({"detail": "User created but failed to log in"}, status=500)

    except Exception as e:
        print(f"Registration Error: {e}")
        return JsonResponse({"detail": "Internal server error during registration"}, status=500)

@csrf_exempt
def api_login(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
      data = json.loads(request.body.decode())
    except Exception:
      return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse({"username": user.username})


@csrf_exempt
def api_logout(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    logout(request)
    return JsonResponse({"ok": True})


def api_me(request):
    if request.user.is_authenticated:
        return JsonResponse(
            {"authenticated": True, "username": request.user.username}
        )
    return JsonResponse({"authenticated": False})
