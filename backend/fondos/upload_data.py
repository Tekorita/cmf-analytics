from fondos.use_cases import obtener_fondos, obtener_series, obtener_valores_por_fecha
from fondos.models import Administradora, Fondo, Serie, ValorCuota
from datetime import datetime, timedelta


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

        Serie.objects.get_or_create(
            fondo=fondo,
            nombre=item.get("SERIE"),
            defaults={
                "valor_cuota_inicial": float(item.get("VAL_CUO_INI", 0)),
                "fecha_inicio": item.get("FEC_INI_SERIE")
            }
        )


def cargar_valores_dia_a_dia(anio, mes):
    # Determinar rango de fechas
    fecha_inicio = datetime(anio, mes, 1)
    if mes == 12:
        fecha_fin = datetime(anio + 1, 1, 1) - timedelta(days=1)
    else:
        fecha_fin = datetime(anio, mes + 1, 1) - timedelta(days=1)

    series_existentes = Serie.objects.values_list("nombre", flat=True).distinct()

    fecha_actual = fecha_inicio
    while fecha_actual <= fecha_fin:
        fecha_str = fecha_actual.strftime("%Y%m%d")
        try:
            response = obtener_valores_por_fecha(fecha_str)
            if "Data" in response:
                for registro in response["Data"]:
                    serie_nombre = registro.get("SERIE")
                    if serie_nombre in series_existentes:
                        try:
                            serie_obj = Serie.objects.get(nombre=serie_nombre)
                            ValorCuota.objects.update_or_create(
                                serie=serie_obj,
                                fecha=fecha_str,
                                defaults={"valor": float(registro.get("VALOR_CUOTA", 0))}
                            )
                        except Serie.DoesNotExist:
                            continue
        except Exception:
            pass

        fecha_actual += timedelta(days=1)
