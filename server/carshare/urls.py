from django.urls import path

from .views import AboutCarView, CarAvailabilityView, HomePage, CarDetails, ListCar, PostCarDetails

urlpatterns = [
    path('', HomePage.as_view(), name='home-page'),
    path('post-data', PostCarDetails.as_view(), name='post-data'),
    path('car/<int:pk>', CarDetails.as_view(), name='carDetails'),
    path('list_car', ListCar.as_view(), name='list_car'),
    path('list_car/', AboutCarView.as_view(), name='about_car'),
    path('list_car/car_availability', CarAvailabilityView.as_view(), name='car_availability'),
]
