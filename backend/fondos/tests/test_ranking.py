from django.test import TestCase
from django.urls import reverse
from fondos.models import Administradora, Fondo, Serie, ValorCuota


class RankingMensualTest(TestCase):
    def setUp(self):
        agf = Administradora.objects.create(nombre="AGF Test")
        fondo = Fondo.objects.create(nombre="Fondo Test", run_fondo="1111", administradora=agf)
        serie = Serie.objects.create(fondo=fondo, nombre="A", valor_cuota_inicial=1000, fecha_inicio="2024-01-01")
        ValorCuota.objects.create(serie=serie, fecha="2024-01-01", valor=1000)
        ValorCuota.objects.create(serie=serie, fecha="2024-01-31", valor=1100)

    def test_ranking_mensual(self):
        response = self.client.get(reverse("ranking_mensual"), {"anio": 2024, "mes": 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.json())
