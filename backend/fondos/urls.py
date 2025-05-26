from django.urls import path
from .views import FondosDataView, FondosSeriesView, ValoresSerieView, ValoresSeriesComparativoView

urlpatterns = [
    path('fondos/', FondosDataView.as_view(), name='fondos-data'),
    path('series/', FondosSeriesView.as_view(), name='fondos-series'),
    path('valores/', ValoresSerieView.as_view(), name='valores-serie'),
    path('dashboard/valores_series/', ValoresSeriesComparativoView.as_view(), name='valores-series-comparativo'),
]
