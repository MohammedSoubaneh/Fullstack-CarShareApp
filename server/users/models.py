from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.db import models
from django.utils.translation import ugettext_lazy as _


class NewUser(AbstractUser):

    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    start_date = models.DateTimeField(default=timezone.now)

    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username