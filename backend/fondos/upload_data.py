import logging

from fondos.use_cases import obtener_fondos, obtener_series, obtener_valores_por_fecha
from fondos.models import Administradora, Fondo, Serie, ValorCuota
from datetime import datetime, timedelta


logger = logging.getLogger(__name__)


def cargar_fondos_y_agfs():
    data = obtener_fondos()
    for item in data.get("Data", []):
        rut_admin = item.get("RUT_ADMINISTRADORA")
        nombre_admin = item.get("NOMBRE_ADMINISTRADORA")
        admin, _ = Administradora.objects.get_or_create(
            rut=rut_admin,
            defaults={"nombre": nombre_admin}
        )

        Fondo.objects.get_or_create(
            run_fondo=item.get("RUN_FONDO"),
            defaults={
                "nombre": item.get("NOMBRE_FONDO"),
                "administradora": admin
            }
        )

def cargar_series():
    data = obtener_series()
    for item in data.get("Data", []):
        try:
            fondo = Fondo.objects.get(run_fondo=item.get("RUN_FONDO"))
        except Fondo.DoesNotExist:
            continue

        valor_cuota = item.get("VAL_CUO_INI")
        valor_cuota = float(valor_cuota) if valor_cuota not in [None, ""] else None

        Serie.objects.get_or_create(
            fondo=fondo,
            nombre=item.get("SERIE"),
            defaults={
                "valor_cuota_inicial": valor_cuota,
                "fecha_inicio": item.get("FEC_INI_SERIE")
            }
        )

def cargar_valores_dia_a_dia(anio, mes):

    fecha_inicio = datetime(anio, mes, 1)
    if mes == 12:
        fecha_fin = datetime(anio + 1, 1, 1) - timedelta(days=1)
    else:
        fecha_fin = datetime(anio, mes + 1, 1) - timedelta(days=1)

    series_existentes = Serie.objects.select_related("fondo").all()
    series_map = {
        (s.fondo.run_fondo, s.nombre): s for s in series_existentes
    }

    fecha_actual = fecha_inicio
    while fecha_actual <= fecha_fin:
        fecha_str = fecha_actual.strftime("%Y%m%d")
        nuevos_valores = []

        try:
            response = obtener_valores_por_fecha(fecha_str)
            if "Data" in response:
                for registro in response["Data"]:
                    clave = (registro.get("RUN_FONDO"), registro.get("SERIE"))
                    serie_obj = series_map.get(clave)

                    if not serie_obj:
                        logger.warning(f"Serie no encontrada: fondo {clave[0]}, serie {clave[1]}")
                        continue

                    nuevos_valores.append(ValorCuota(
                        serie=serie_obj,
                        fecha=fecha_str,
                        valor=float(registro.get("VALOR_CUOTA", 0))
                    ))
        except Exception as e:
            logger.error(f"Error al procesar la fecha {fecha_str}: {e}")

        # Inserta en bloque (ignora si ya existen)
        if nuevos_valores:
            ValorCuota.objects.bulk_create(nuevos_valores, ignore_conflicts=True)
            logger.info(f"{len(nuevos_valores)} valores insertados para {fecha_str}")

        fecha_actual += timedelta(days=1)
