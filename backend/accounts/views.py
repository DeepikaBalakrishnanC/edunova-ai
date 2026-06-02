from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile


VALID_ROLES = {"admin", "teacher", "student"}
REGISTRATION_ROLES = {"teacher", "student"}


def _user_payload(user):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return {
        "id": user.id,
        "name": user.get_full_name() or user.username,
        "username": user.username,
        "email": user.email,
        "role": profile.role,
        "status": "active",
    }


@api_view(["POST"])
def register_user(request):
    name = (request.data.get("name") or "").strip()
    username = (request.data.get("username") or "").strip()
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""
    role = request.data.get("role") or "student"

    if role not in VALID_ROLES:
        return Response({"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)

    if role not in REGISTRATION_ROLES:
        return Response({"error": "Admin registration is disabled."}, status=status.HTTP_400_BAD_REQUEST)

    if not username or not email or len(password) < 6:
        return Response(
            {"error": "Username, email, and a password of at least 6 characters are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username__iexact=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    first_name = name.split(" ", 1)[0] if name else username
    last_name = name.split(" ", 1)[1] if " " in name else ""
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        is_staff=role in {"admin", "teacher"},
        is_superuser=role == "admin",
    )
    UserProfile.objects.create(user=user, role=role)
    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": _user_payload(user),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": _user_payload(user),
    })
