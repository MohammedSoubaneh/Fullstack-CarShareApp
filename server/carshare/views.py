from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, BasePermission, SAFE_METHODS
from .models import CarModel, AboutCar, CarAvailability, CarDetail, CarPhoto, ListCarModel
from .serializers import CarModelSerializer, AboutCarSerializer, CarAvailabilitySerializer, CarDetailSerializer, CarPhotoSerializer


class PostUserWritePermission(BasePermission):
    message = 'Editing posts is restricted to the author only.'

    def has_object_permission(self, request, view, obj):
        
        if request.method in SAFE_METHODS:
            return True

        return obj.author == request.user 


class HomePage(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request, format=None):
        car = CarModel.objects.all()
        serializer = CarModelSerializer(car, many=True)
        return Response(serializer.data)


class PostCarDetails(APIView, PostUserWritePermission):
    permission_classes = [PostUserWritePermission]
    # parser_classes = [MultiPartParser, FormParser]
    def post(self, request, format=None):
        serializer = CarModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CarDetails(APIView, PostUserWritePermission):
    permission_classes = [PostUserWritePermission]

    def get_object(self, pk):
        try:
            return CarModel.objects.get(pk=pk)
        except CarModel.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        car = self.get_object(pk)
        serializer = CarModelSerializer(car)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        car = self.get_object(pk)
        serializer = CarModelSerializer(car, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        car = self.get_object(pk)
        car.delete()
        return Response(status= status.HTTP_204_NO_CONTENT)

class ListCar(APIView):

    def get(self, request, format=None):
        about_car = AboutCar.objects.all()
        car_availability = CarAvailability.objects.all()
        car_detail = CarDetail.objects.all()
        car_photo = CarPhoto.objects.all()
        about_serializer = AboutCarSerializer(about_car, many=True)
        car_availability_serializer = CarAvailabilitySerializer(car_availability, many=True)
        car_details_serializer = CarDetailSerializer(car_detail, many=True)
        car_photo_serializer = CarPhotoSerializer(car_photo, many=True)
        return Response({
            'car_photo': car_photo_serializer.data,
            }, status=status.HTTP_200_OK)


class AboutCarView(APIView):

    def post(self, request, format=None):
        serializer = AboutCarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CarAvailabilityView(APIView):

    def post(self, request, format=None):
        serializer = CarAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)