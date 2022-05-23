from django.contrib import admin
from . import models

@admin.register(models.CarModel)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'rating')


admin.site.register(models.Category)