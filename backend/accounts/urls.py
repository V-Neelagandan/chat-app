# backend/accounts/urls.py
from django.urls import path
from . import views, api_views

urlpatterns = [
    # HTML pages
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register_view, name="register"),

    # API endpoints for React
    path("api/login/", api_views.api_login, name="api_login"),
    path("api/logout/", api_views.api_logout, name="api_logout"),
    path("api/me/", api_views.api_me, name="api_me"),
    path("api/register/", api_views.api_register, name="api_register"), # <-- NEW PATH
]
