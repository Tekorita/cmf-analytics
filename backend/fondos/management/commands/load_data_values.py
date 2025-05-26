import logging
from django.core.management.base import BaseCommand
from fondos.upload_data import cargar_valores_dia_a_dia
from datetime import datetime

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Carga valores comparativos de todas las series existentes en un mes y año dado'

    def add_arguments(self, parser):
        parser.add_argument('anio', type=int, help='Año en formato YYYY')
        parser.add_argument('mes', type=int, help='Mes en formato MM')

    def handle(self, *args, **options):
        anio = options['anio']
        mes = options['mes']

        try:
            datetime(year=anio, month=mes, day=1)  # validación básica
        except ValueError:
            logger.error("Año o mes inválido.")
            return

        logger.info(f"Cargando valores del {anio}-{mes:02d}...")
        cargar_valores_dia_a_dia(anio, mes)
        logger.info("✔ Valores del mes cargados exitosamente.")
