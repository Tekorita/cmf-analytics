from datetime import datetime

def parse_fecha_segura(fecha_raw):
    """
    Convierte una fecha en string o date a formato YYYY-MM-DD.
    Soporta strings en formato 'YYYYMMDD' o 'YYYY-MM-DD', y objetos datetime/date.
    """
    try:
        if isinstance(fecha_raw, str):
            if len(fecha_raw) == 8:
                return datetime.strptime(fecha_raw, "%Y%m%d").strftime("%Y-%m-%d")
            else:
                return datetime.strptime(fecha_raw, "%Y-%m-%d").strftime("%Y-%m-%d")
        return fecha_raw.strftime("%Y-%m-%d")
    except Exception:
        return str(fecha_raw)
