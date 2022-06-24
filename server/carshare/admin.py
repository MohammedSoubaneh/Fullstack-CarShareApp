from django.contrib import admin
from . import models

@admin.register(models.CarModel)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'rating')

admin.site.register(models.AboutCar) 
admin.site.register(models.CarAvailability)
admin.site.register(models.Category)
admin.site.register(models.CarDetail)
admin.site.register(models.CarPhoto)