from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
    except (ValueError, KeyError):
        return JsonResponse({"error": "JSON inválido o incompleto"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"mensaje": "Login exitoso", "usuario": user.username})
    else:
        return JsonResponse({"error": "Credenciales inválidas"}, status=401)
