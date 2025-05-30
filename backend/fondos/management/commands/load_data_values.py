import logging
from django.core.management.base import BaseCommand
from fondos.upload_data import cargar_valores_dia_a_dia
from datetime import datetime

logger = logging.getLogger(__name__)

def cargar_valores_de_todo_el_anio(anio):
    for mes in range(1, 13):
        try:
            logger.info(f"Cargando valores del {anio}-{mes:02d}...")
            cargar_valores_dia_a_dia(anio, mes)
            logger.info(f"✔ Valores del mes {mes:02d} cargados exitosamente.")
        except Exception as e:
            logger.error(f"❌ Error cargando el mes {mes:02d}: {e}")

class Command(BaseCommand):
    help = 'Carga valores comparativos de todas las series existentes para un mes y año, o para todo un año'

    def add_arguments(self, parser):
        parser.add_argument('anio', type=int, help='Año en formato YYYY')
        parser.add_argument('--mes', type=int, help='Mes en formato MM (opcional)')

    def handle(self, *args, **options):
        anio = options['anio']
        mes = options.get('mes')

        if mes:
            try:
                datetime(year=anio, month=mes, day=1)  # validación básica
            except ValueError:
                logger.error("Año o mes inválido.")
                return

            logger.info(f"Cargando valores del {anio}-{mes:02d}...")
            cargar_valores_dia_a_dia(anio, mes)
            logger.info("✔ Valores del mes cargados exitosamente.")
        else:
            logger.info(f"Cargando valores de TODO el año {anio}...")
            cargar_valores_de_todo_el_anio(anio)
