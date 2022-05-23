from django.db import models
from django.contrib.auth.models import User 
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class CarModel(models.Model):

    category = models.ForeignKey(Category, on_delete=models.PROTECT, default=1)
    name = models.CharField(max_length=50, db_column='name', null=True)
    year = models.IntegerField(max_length=4, default=1)
    rating = models.IntegerField(max_length=4, default=1)
    trips = models.IntegerField(max_length=3, default=0)
    safetyCheck = models.BooleanField(default=False)
    freeDelivery = models.BooleanField(default=False)
    cost = models.IntegerField(max_length=3, default=0)
    image = models.ImageField(null=True, blank=True, upload_to="images/")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='car_post')

    def __str__(self):
        return self.name
     


