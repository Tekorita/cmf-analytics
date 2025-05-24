import os
import json
import http.client
from django.http import JsonResponse
from django.views import View
from datetime import datetime

HEADERS = {
    "Authorization": f"Basic {os.getenv('CMF_BASIC_AUTH')}",
    "Cookie": os.getenv("CMF_COOKIE"),
}


class FondosDataView(View):
    def get(self, request):
        try:
            conn = http.client.HTTPSConnection("www.cmfchile.cl")
            conn.request(
                "GET",
                "/sitio/api/fmide/identificacion/json",
                "",  # payload vacío
                HEADERS,
            )
            response = conn.getresponse()
            raw_data = response.read().decode("utf-8")
            parsed_data = json.loads(raw_data)

            return JsonResponse(parsed_data, safe=False)

        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener datos desde el portal de la CMF",
                "detalle": str(e)
            }, status=500)


class FondosSeriesView(View):
    def get(self, request):
        try:
            conn = http.client.HTTPSConnection("www.cmfchile.cl")
            conn.request(
                "GET",
                "/sitio/api/foser/series/json",
                "",
                HEADERS,
            )
            response = conn.getresponse()
            data = json.loads(response.read())

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener series de fondos desde CMF",
                "detalle": str(e)
            }, status=500)


class ValoresSerieView(View):
    def get(self, request):
        fecha = request.GET.get("fecha")  # formato esperado: YYYYMMDD
        if not fecha:
            return JsonResponse({"error": "Parámetro 'fecha' requerido en formato YYYYMMDD"}, status=400)

        try:
            datetime.strptime(fecha, "%Y%m%d")  # validar fecha
            conn = http.client.HTTPSConnection("www.cmfchile.cl")
            conn.request(
                "GET",
                f"/sitio/api/fmcfm/consulta_cartola/{fecha}/json",
                "",
                HEADERS,
            )
            response = conn.getresponse()
            data = json.loads(response.read())

            return JsonResponse(data, safe=False)

        except ValueError:
            return JsonResponse({"error": "Formato de fecha inválido, debe ser YYYYMMDD"}, status=400)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener cartola desde CMF",
                "detalle": str(e)
            }, status=500)
