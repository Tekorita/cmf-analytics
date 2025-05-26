import json
import http.client
from django.conf import settings
from datetime import datetime

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
