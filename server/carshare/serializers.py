from rest_framework import serializers
from carshare.models import CarModel, AboutCar, CarAvailability, CarDetail, CarPhoto, ListCarModel


class CarModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = CarModel
        fields = ['id', 'name', 'year', 'rating', 'author', 'image']

    def create(self, validated_data):
        """
        Create and return a new 'CarModel' instance, given the validated data.
        """
        return CarModel.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     """
    #     Update and return an existing 'CarModel' instance, given the validated data.
    #     """

    #     instance.name = validated_data.get('name', instance.name)
    #     instance.year = validated_data.get('year', instance.year)
        
    #     instance.save()
    #     return instance

class AboutCarSerializer(serializers.ModelSerializer):

    class Meta:
        model = AboutCar
        fields = ['id', 'location', 'year', 'make', 'model', 'transmission', 'odometer', 'author']

class CarAvailabilitySerializer(serializers.ModelSerializer):
    about_car = AboutCarSerializer(read_only=True)

    class Meta:
        model = CarAvailability
        fields = ['id', 'notice', 'shortest_possible_duration', 'longest_possible_duration', 'about_car']

class CarDetailSerializer(serializers.ModelSerializer):
    car_availability = CarAvailabilitySerializer(read_only=True)
    class Meta:
        model = CarDetail
        fields = [
            'id', 'plate_number', 'state_or_province', 
            'car_description', 'ev_hybrid', 'bike_rack',
            'all_wheel_drive', 'child_seat', 'snow_tires_or_chains',
            'gps', 'ski_rack', 'bluetooth', 'usb_input',
            'heated_seats', 'audio_input', 'convertible',
            'pet_friendly', 'toll_pass', 'sunroof', 'car_availability'
            ]

class CarPhotoSerializer(serializers.ModelSerializer):
    car_details = CarDetailSerializer(read_only=True)
    class Meta:
        model = CarPhoto
        fields = ['image', 'car_details']

