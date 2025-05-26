from django.http import JsonResponse
from django.views import View
from .models import Fondo, Serie, ValorCuota
from .use_cases import obtener_ranking_mensual, obtener_alertas_insights
from .serializers import SerieValorCuotaComparativaSerializer


class FondosDataView(View):
    def get(self, request):
        try:
            data = list(Fondo.objects.select_related("administradora").values(
                "id", "run_fondo", "nombre", "administradora__nombre"
            ))
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener datos de los fondos",
                "detalle": str(e)
            }, status=500)


class FondosSeriesView(View):
    def get(self, request):
        try:
            data = list(Serie.objects.select_related("fondo").values(
                "id", "nombre", "fondo__id", "fondo__nombre"
            ))
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener series desde la base de datos",
                "detalle": str(e)
            }, status=500)


class ValoresSerieView(View):
    def get(self, request):
        fecha = request.GET.get("fecha")
        if not fecha:
            return JsonResponse({"error": "Parámetro 'fecha' requerido en formato YYYYMMDD"}, status=400)

        try:
            data = list(ValorCuota.objects.filter(fecha=fecha).values(
                "serie__id", "serie__nombre", "serie__fondo__nombre", "fecha", "valor"
            ))
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener cartola desde la base de datos",
                "detalle": str(e)
            }, status=500)


class ValoresSeriesComparativoView(View):
    def get(self, request):
        series = request.GET.get("series")
        fechas = request.GET.get("fechas")

        if not series or not fechas:
            return JsonResponse({"error": "Parámetros 'series' y 'fechas' son requeridos"}, status=400)

        try:
            series_list = series.split(",")
            fechas_list = fechas.split(",")

            result = {}
            for serie_nombre in series_list:
                registros = ValorCuota.objects.filter(
                    serie__nombre=serie_nombre,
                    fecha__in=fechas_list
                ).select_related("serie", "serie__fondo")

                result[serie_nombre] = [
                    {
                        "fecha": r.fecha,
                        "valor_cuota": r.valor,
                        "fondo": r.serie.fondo.nombre,
                        "serie": r.serie.nombre,
                    }
                    for r in registros
                ]

            serialized = SerieValorCuotaComparativaSerializer(result).data
            return JsonResponse(serialized, safe=False)

        except Exception as e:
            return JsonResponse({
                "error": "No se pudo obtener comparativo de valores",
                "detalle": str(e)
            }, status=500)


class RankingMensualView(View):
    def get(self, request):
        anio = request.GET.get("anio")
        mes = request.GET.get("mes")
        fondo_id = request.GET.get("fondo")
        agf_id = request.GET.get("agf")
        page = request.GET.get("page", 1)
        page_size = request.GET.get("page_size", 50)

        try:
            data = obtener_ranking_mensual(
                int(anio), int(mes),
                fondo_id=int(fondo_id) if fondo_id else None,
                agf_id=int(agf_id) if agf_id else None,
                page=int(page),
                page_size=int(page_size)
            )
            return JsonResponse(data, safe=False)
        except ValueError as ve:
            return JsonResponse({"error": str(ve)}, status=400)
        except Exception as e:
            return JsonResponse({
                "error": "Error al calcular el ranking mensual",
                "detalle": str(e)
            }, status=500)


class AlertasInsightsView(View):
    def get(self, request):
        fecha_inicio = request.GET.get("fecha_inicio")
        fecha_fin = request.GET.get("fecha_fin")
        umbral = request.GET.get("umbral", "0.05")  # por defecto 5%
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 50))

        if not fecha_inicio or not fecha_fin:
            return JsonResponse({"error": "Los parámetros 'fecha_inicio' y 'fecha_fin' son requeridos (formato YYYYMMDD)."}, status=400)

        try:
            insights = obtener_alertas_insights(fecha_inicio, fecha_fin, float(umbral), page, page_size)
            return JsonResponse(insights, safe=False)
        except ValueError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Error al procesar el análisis de alertas", "detalle": str(e)}, status=500)
