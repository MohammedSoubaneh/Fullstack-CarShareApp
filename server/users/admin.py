from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import NewUser
from django.db import models


class UserAdminConfig(UserAdmin):
    model = NewUser
    search_fields = ('email', 'username', 'first_name', 'last_name')
    list_filter = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')
    ordering = ('-start_date',)
    list_display = ('email', 'username', 'first_name', 'last_name',
                    'is_active', 'is_staff')

admin.site.register(NewUser, UserAdminConfig)
