from django.db import models


class Administradora(models.Model):
    rut = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre


class Fondo(models.Model):
    run_fondo = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=255)
    administradora = models.ForeignKey(Administradora, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


class Serie(models.Model):
    fondo = models.ForeignKey(Fondo, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=20)
    valor_cuota_inicial = models.FloatField(null=True, blank=True)
    fecha_inicio = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"{self.fondo.nombre} - Serie {self.nombre}"


class ValorCuota(models.Model):
    serie = models.ForeignKey(Serie, on_delete=models.CASCADE)
    fecha = models.CharField(max_length=20)
    valor = models.FloatField()

    class Meta:
        unique_together = ("serie", "fecha")

    def __str__(self):
        return f"{self.serie.nombre} - {self.fecha}: {self.valor}"
