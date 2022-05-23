from django.urls import path

from .views import HomePage, CarDetails, PostCarDetails

urlpatterns = [
    path('', HomePage.as_view(), name='home-page'),
    path('post-data', PostCarDetails.as_view(), name='post-data'),
    path('car/<int:pk>', CarDetails.as_view(), name='carDetails'),
]
