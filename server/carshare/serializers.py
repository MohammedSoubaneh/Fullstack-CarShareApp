from rest_framework import serializers
from carshare.models import CarModel

class CarModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = CarModel
        fields = ['id', 'name', 'year', 'rating', 'author']

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