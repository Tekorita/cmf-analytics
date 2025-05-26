import json
import http.client
from django.conf import settings
from datetime import datetime, timedelta
from django.core.paginator import Paginator
from django.db.models import F, FloatField, ExpressionWrapper
from django.db.models.functions import Cast

from fondos.models import ValorCuota


HEADERS = {
    "Authorization": f"Basic {settings.CMF_BASIC_AUTH}",
    "Cookie": settings.CMF_COOKIE,
}

def obtener_fondos():
    conn = http.client.HTTPSConnection("www.cmfchile.cl")
    conn.request("GET", "/sitio/api/fmide/identificacion/json", "", HEADERS)
    response = conn.getresponse()
    return json.loads(response.read().decode("utf-8"))

def obtener_series():
    conn = http.client.HTTPSConnection("www.cmfchile.cl")
    conn.request("GET", "/sitio/api/foser/series/json", "", HEADERS)
    response = conn.getresponse()
    return json.loads(response.read().decode("utf-8"))

def obtener_valores_por_fecha(fecha):
    try:
        datetime.strptime(fecha, "%Y%m%d")
    except ValueError:
        raise ValueError("Formato de fecha inválido. Debe ser YYYYMMDD")

    conn = http.client.HTTPSConnection("www.cmfchile.cl")
    conn.request("GET", f"/sitio/api/fmcfm/consulta_cartola/{fecha}/json", "", HEADERS)
    response = conn.getresponse()
    return json.loads(response.read().decode("utf-8"))

def obtener_valores_comparativos(series_list, fechas_list):
    result = {}
    for serie in series_list:
        serie_data = []
        for fecha in fechas_list:
            try:
                conn = http.client.HTTPSConnection("www.cmfchile.cl")
                conn.request("GET", f"/sitio/api/fmcfm/consulta_cartola/{fecha}/json", "", HEADERS)
                response = conn.getresponse()
                data = json.loads(response.read())

                if "Data" in data:
                    for registro in data["Data"]:
                        if registro.get("SERIE") == serie:
                            serie_data.append({
                                "fecha": fecha,
                                "valor_cuota": float(registro.get("VALOR_CUOTA", 0)),
                                "fondo": registro.get("NOMBRE_FONDO"),
                                "serie": serie
                            })
            except Exception:
                continue

        result[serie] = serie_data
    return result

def obtener_ranking_mensual(anio, mes, fondo_id=None, agf_id=None, page=1, page_size=50):
    # Validación básica de fecha
    try:
        fecha_inicio = datetime(anio, mes, 1)
        fecha_fin = (fecha_inicio.replace(month=mes % 12 + 1, day=1) - timedelta(days=1)) if mes < 12 else datetime(anio + 1, 1, 1) - timedelta(days=1)
    except ValueError:
        raise ValueError("Año o mes inválido.")

    # Validación de paginación
    if page < 1 or page_size < 1:
        raise ValueError("'page' y 'page_size' deben ser mayores que cero.")

    filtros = {}

    if fondo_id:
        if not Fondo.objects.filter(id=fondo_id).exists():
            raise ValueError("Fondo no existe.")
        filtros['serie__fondo_id'] = fondo_id

    if agf_id:
        if not Administradora.objects.filter(id=agf_id).exists():
            raise ValueError("Administradora no existe.")
        filtros['serie__fondo__administradora_id'] = agf_id

    valores = ValorCuota.objects.filter(
        fecha__range=[fecha_inicio, fecha_fin],
        **filtros
    ).select_related('serie__fondo')

    ranking = []
    fondos_series = {}

    for vc in valores:
        clave = (vc.serie.fondo.id, vc.serie.id)
        fondos_series.setdefault(clave, []).append(vc)

    for (fondo_id, serie_id), registros in fondos_series.items():
        registros_ordenados = sorted(registros, key=lambda x: x.fecha)
        if len(registros_ordenados) < 2:
            continue
        inicio = registros_ordenados[0].valor
        fin = registros_ordenados[-1].valor
        if inicio > 0:
            rentabilidad = (fin / inicio) - 1
            ranking.append({
                "fondo": registros_ordenados[0].serie.fondo.nombre,
                "serie": registros_ordenados[0].serie.nombre,
                "rentabilidad": round(rentabilidad, 6),
                "inicio": registros_ordenados[0].fecha,
                "fin": registros_ordenados[-1].fecha
            })

    # Ordenar ranking
    ranking.sort(key=lambda x: x["rentabilidad"], reverse=True)

    # Paginar
    paginator = Paginator(ranking, page_size)
    page_obj = paginator.get_page(page)

    return {
        "page": page_obj.number,
        "total_pages": paginator.num_pages,
        "total_items": paginator.count,
        "results": page_obj.object_list
    }

def obtener_alertas_insights(fecha_inicio_str, fecha_fin_str, umbral=0.05, page=1, page_size=50):
    try:
        fecha_inicio = datetime.strptime(fecha_inicio_str, "%Y%m%d")
        fecha_fin = datetime.strptime(fecha_fin_str, "%Y%m%d")
    except ValueError:
        raise ValueError("Formato de fecha inválido. Usa YYYYMMDD")

    valores = ValorCuota.objects.filter(
        fecha__gte=fecha_inicio_str,
        fecha__lte=fecha_fin_str
    ).select_related("serie__fondo")

    agrupado = {}
    for vc in valores:
        clave = (vc.serie.id, vc.serie.nombre, vc.serie.fondo.nombre)
        agrupado.setdefault(clave, []).append(vc)

    alertas = []

    for (serie_id, serie_nombre, fondo_nombre), registros in agrupado.items():
        registros_ordenados = sorted(registros, key=lambda x: x.fecha)
        if len(registros_ordenados) < 2:
            continue

        inicio = registros_ordenados[0].valor
        fin = registros_ordenados[-1].valor

        if inicio == 0:
            continue

        variacion = (fin - inicio) / inicio

        if abs(variacion) >= umbral:
            alertas.append({
                "serie": serie_nombre,
                "fondo": fondo_nombre,
                "fecha_inicio": registros_ordenados[0].fecha,
                "valor_inicio": inicio,
                "fecha_fin": registros_ordenados[-1].fecha,
                "valor_fin": fin,
                "variacion": round(variacion * 100, 2)
            })

    paginator = Paginator(alertas, page_size)
    page_obj = paginator.get_page(page)

    return {
        "page": page_obj.number,
        "total_pages": paginator.num_pages,
        "total_items": paginator.count,
        "results": page_obj.object_list
    }

