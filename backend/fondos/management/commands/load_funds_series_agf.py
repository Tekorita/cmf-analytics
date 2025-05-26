import logging
from django.core.management.base import BaseCommand
from fondos.upload_data import cargar_fondos_y_agfs, cargar_series

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Carga datos de administradoras, fondos y series desde la API de la CMF'

    def handle(self, *args, **kwargs):
        logger.info("Cargando administradoras y fondos...")
        cargar_fondos_y_agfs()
        logger.info("✔ Fondos y AGFs cargados")

        logger.info("Cargando series...")
        cargar_series()
        logger.info("✔ Series cargadas")
