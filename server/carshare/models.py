from email.policy import default
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User 
from django.utils.translation import gettext_lazy as _
from django.conf import settings


def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)

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
    safety_check = models.BooleanField(default=False)
    free_delivery = models.BooleanField(default=False)
    cost = models.IntegerField(max_length=3, default=0)
    image = models.ImageField(_("Image"), upload_to=upload_to, default='test_image.jpg')

    def __str__(self):
        return self.name
     

class BaseModel(models.Model):
    created_at = models.DateTimeField(db_index=True, default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class AboutCar(BaseModel):

    MAKE_CHOICES = (
        ('Selected', 'Selected'),
        ('honda','HONDA'),
        ('toyota','TOYOTA'),
        ('jeep','JEEP'),
    )

    MODEL_CHOICE = (
        ('Selected', 'Selected'),
        ('Honda', (
            ('SUV & Crossovers', 'SUV & CROSSOVERS'),
            ('Sedans', 'SEDANS'),
            ('Hatchbacks', 'HATCHBACKS'),
            ('Minivans', 'MINIVANS'),
        )),
        ('Toyota', (
            ('Corolla', 'COROLLA'),
            ('Avalon', 'AVALON'),
            ('Prius', 'PRIUS')
        )),
        ('Jeep', (
            ('SUV', 'SUV'),
            ('Trucks', 'TRUCKS')
        )),
    )

    TRANSMISSION_CHOICES = (
        ('Selected', 'Selected'),
        ('Manual', 'MANUAL'),
        ('Automatic', 'AUTOMATIC')
    )

    ODOMETER_CHOICES = (
        ('Selected', 'Selected'),
        ('0-50k miles', '0-50K MILES'),
        ('50k-100k miles', '50-100K MILES'),
        ('100k-130k miles', '100K-130K MILES'),
        ('130k+ miles', '130K+ MILES')
    )

    location = models.CharField(max_length=250, db_column='location', null=False)
    year = models.IntegerField(max_length=4, default=1)
    make = models.CharField(max_length=50, choices=MAKE_CHOICES, default='Selected')
    model = models.CharField(max_length=50, choices=MODEL_CHOICE, default='Selected')
    transmission = models.CharField(max_length=50, choices=TRANSMISSION_CHOICES, default='Selected')
    odometer = models.CharField(max_length=50, choices=ODOMETER_CHOICES, default='Selected')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='car_post')

    def __str__(self):
        return self.location

class CarAvailability(models.Model):

    ADCANCE_NOTICE_CHOICES = (
        ('Advance notice', 'Advance notice'),
        ('1 hour', '1 HOUR'),
        ('2 hours', '2 HOURS'),
        ('3 hours', '3 HOURS'),
        ('6 hours', '6 HOURS'),
        ('12 hours', '12 HOURS'),
        ('1 day', '1 DAY'),
        ('2 days', '2 DAYS'),
        ('3 days', '3 DAYS'),
        ('1 week', '1 WEEK')
    )

    MINIMUM_DURATION_CHOICES = (
        ('Minimum duration', 'Minimum duration'),
        ('Any', 'Any'),
        ('1 day', '1 day'),
        ('2 days', '2 days'),
        ('3 days', '3 days'),
        ('5 days', '5 days'),
        ('1 week', '1 week'),
        ('2 weeks', '2 weeks'),
        ('1 month', '1 month')
    )

    MAXIMUM_DURATION_CHOICES = (
        ('Maximum duration', 'Maximum duration'),
        ('3 days', '3 days'),
        ('5 days', '5 days'),
        ('1 week', '1 week'),
        ('2 weeks', '2 weeks'),
        ('1 month', '1 month'),
        ('3 months', '3 months'),
        ('Any', 'Any')        
    )

    notice = models.CharField(max_length=50, choices=ADCANCE_NOTICE_CHOICES, default='Advance notice')
    shortest_possible_duration = models.CharField(max_length=50, choices=MINIMUM_DURATION_CHOICES, default='Minimum duration')
    longest_possible_duration = models.CharField(max_length=50, choices=MAXIMUM_DURATION_CHOICES, default='Maximum duration')
    about_car = models.OneToOneField(AboutCar, unique=True, on_delete=models.CASCADE, null=True, related_name='about_car')


    def __str__(self):
        return self.notice


class CarDetail(models.Model):

    STATE_OR_PROVINCE = (
        ('State', (
            ('California', 'California'),
            ('Florida', 'Florida'),
            ('Minnesota', 'Minnesota'),
            ('New Jersey', 'New Jersey'),
            ('New York', 'New York')  
        )),
        ('Province', (
            ('Alberta', 'Alberta'),
            ('Ontario', 'Ontario'),
            ('Quebec', 'Quebec')
        ))
    )

    plate_number = models.CharField(max_length=7, default='')
    state_or_province = models.CharField(max_length=50, choices=STATE_OR_PROVINCE, default='State or Province')
    car_description = models.CharField(max_length=250, default='')
    ev_hybrid = models.BooleanField(default=False)
    bike_rack = models.BooleanField(default=False)
    all_wheel_drive = models.BooleanField(default=False)
    child_seat = models.BooleanField(default=False)
    snow_tires_or_chains = models.BooleanField(default=False)
    gps = models.BooleanField(default=False)
    ski_rack = models.BooleanField(default=False)
    bluetooth = models.BooleanField(default=False)
    usb_input = models.BooleanField(default=False)
    heated_seats = models.BooleanField(default=False)
    audio_input = models.BooleanField(default=False)
    convertible = models.BooleanField(default=False)
    pet_friendly = models.BooleanField(default=False)
    toll_pass = models.BooleanField(default=False)
    sunroof = models.BooleanField(default=False)
    car_availability = models.OneToOneField(CarAvailability, unique=True, on_delete=models.CASCADE, null=True, related_name='car_availability')



class CarPhoto(models.Model):
    image = models.ImageField(_("Image"), upload_to=upload_to, default='test_image.jpg')
    car_details = models.OneToOneField(CarDetail, unique=True, on_delete=models.CASCADE, null=True, related_name='car_details')



class ListCarModel(models.Model):
    car_listing_details = models.OneToOneField(CarPhoto, on_delete=models.CASCADE, null=True, related_name='author_car')

    def __str__(self):
        return 'Car Details'

