from rest_framework import serializers


class ValorCuotaSerializer(serializers.Serializer):
    fecha = serializers.CharField()
    valor_cuota = serializers.FloatField()
    fondo = serializers.CharField()
    serie = serializers.CharField()


class SerieValorCuotaComparativaSerializer(serializers.Serializer):
    def to_representation(self, data):
        return {
            serie: ValorCuotaSerializer(valores, many=True).data
            for serie, valores in data.items()
        }
