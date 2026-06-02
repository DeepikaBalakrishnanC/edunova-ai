import os

import google.generativeai as genai
from dotenv import load_dotenv
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

genai.configure(api_key=GEMINI_API_KEY)


@api_view(["POST"])
def ai_chat(request):
    message = (request.data.get("message") or "").strip()

    if not message:
        return Response(
            {"error": "Please enter a message."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not GEMINI_API_KEY:
        return Response(
            {"error": "Gemini API key is not configured."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    print("USER MESSAGE:", message)

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(message)
        reply = getattr(response, "text", "").strip()

        if not reply:
            return Response(
                {"error": "Gemini returned an empty response."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"reply": reply})
    except Exception as exc:
        print("GEMINI ERROR:", str(exc))

        return Response(
            {
                "error": "AI assistant is temporarily unavailable. Please check your Gemini API key, model, or quota.",
                "detail": str(exc),
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )
