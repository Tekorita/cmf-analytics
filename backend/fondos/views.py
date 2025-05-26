from django.http import JsonResponse
from django.views import View
from .use_cases import (
    obtener_fondos,
    obtener_series,
    obtener_valores_por_fecha,
    obtener_valores_comparativos
)
from .serializers import SerieValorCuotaComparativaSerializer


class FondosDataView(View):
    def get(self, request):
        try:
            data = obtener_fondos()
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener datos desde el portal de la CMF",
                "detalle": str(e)
            }, status=500)


class FondosSeriesView(View):
    def get(self, request):
        try:
            data = obtener_series()
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener series de fondos desde CMF",
                "detalle": str(e)
            }, status=500)


class ValoresSerieView(View):
    def get(self, request):
        fecha = request.GET.get("fecha")
        if not fecha:
            return JsonResponse({"error": "Parámetro 'fecha' requerido en formato YYYYMMDD"}, status=400)

        try:
            data = obtener_valores_por_fecha(fecha)
            return JsonResponse(data, safe=False)
        except ValueError as ve:
            return JsonResponse({"error": str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener cartola desde CMF",
                "detalle": str(e)
            }, status=500)


class ValoresSeriesComparativoView(View):
    def get(self, request):
        series = request.GET.get("series")
        fechas = request.GET.get("fechas")

        if not series or not fechas:
            return JsonResponse({"error": "Parámetros 'series' y 'fechas' son requeridos"}, status=400)

        try:
            raw_result = obtener_valores_comparativos(series.split(","), fechas.split(","))
            serialized = SerieValorCuotaComparativaSerializer(raw_result).data
            return JsonResponse(serialized, safe=False)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener comparativo de valores",
                "detalle": str(e)
            }, status=500)
