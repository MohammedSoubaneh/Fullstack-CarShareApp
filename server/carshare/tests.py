from email.mime import image
import io
import mock
from carshareapp import settings
from django.core.files import File
from django.urls import include, path, reverse
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import Http404
from .models import CarModel, Category
from rest_framework import status
from rest_framework.test import APITestCase

from PIL import Image





class CategoryTest(TestCase):

    def test_category_model_field(self):
        category = Category(name = 'Car Details')
        self.assertEqual(category.name, 'Car Details')
        self.assertEqual(str(category), category.name)

class CarModelTest(TestCase):

    def test_car_model_fields(self):
        self.file_mock = mock.MagicMock(spec=File, name='ImageMock')
        small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
        category = Category(name ='Car Details')

        car = CarModel(
            category = category,
            name='Honda Civic', 
            year=2019, 
            rating=10, 
            trips=10,
            safety_check=True, 
            free_delivery=True, 
            cost=100,
            image= SimpleUploadedFile('small.gif', small_gif, content_type='image/gif'),
            )

        self.assertEqual(car.category, category)
        self.assertEqual(car.name, "Honda Civic")
        self.assertEqual(car.year, 2019)
        self.assertEqual(car.rating, 10)
        self.assertEqual(car.trips, 10)
        self.assertTrue(car.safety_check)
        self.assertTrue(car.free_delivery)
        self.assertEqual(car.cost, 100)
        self.assertEqual(str(car), car.name)
        self.assertTrue(car.image)


class CarShareHomePage(APITestCase):

    def setUp(self):
        return Category.objects.create(name = 'Car list')


    urlpatterns = [
        path('/', include('carshare.urls'))
    ]    


    def test_homepage(self):
        url = reverse('home-page')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

class CarSharePost(APITestCase):

    def setUp(self):
        return Category.objects.create(name = 'Car Details')


    urlpatterns = [
        path('/', include('carshare.urls'))
    ]    

    def test_post_response_data(self):
        User = get_user_model()
        User.objects.create_user(username='test_user1', password='1234245')
        self.assertTrue(self.client.login(username='test_user1', password='1234245'))
        url = reverse('post-data')
        response = self.client.post(url, {'name': 'Toyota', 'year': 2020, 'rating': 10, 'author': 1}, format="json", follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_response_data_error(self):
        url = reverse('post-data')
        response = self.client.post(url, {'name': 'Toyota', 'year': 2020, 'rating': 10, 'author': 1}, format="json", follow=True)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CarShareDetails(APITestCase):
    def setUp(self):
        User = get_user_model()
        user = User.objects.create_user(username='test_user1', password='1234245')
        self.file_mock = mock.MagicMock(spec=File, name='ImageMock')
        Category.objects.create(name = 'Car Details')
        self.first_car = CarModel.objects.create(name='Toyota', year=2020, rating=8, author= user)  
        self.valid_post = {
            'name': 'Honda',
            'year': 2022,
            'rating': 10,
            'author': 1
        }      
        self.valid_post2 = {
            'name': 'Honda',
            'year': 2022,
            'rating': 10,
            'author': 2,
            'image': '/media/harrison-fitts-zE2VGbJSYns-unsplash.jpg'
        }


    def test_retrieve_specific_car(self):
        url = reverse('carDetails', kwargs={'pk': self.first_car.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CarModel.objects.count(), 1)

    def test_update_specific_car(self):
        url = reverse('carDetails', kwargs={'pk': self.first_car.pk})
        response = self.client.put(url, data=self.valid_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CarModel.objects.count(), 1)

    def test_delete_specific_car(self):
        url = reverse('carDetails', kwargs={'pk': self.first_car.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_update_specific_car_error(self):
        url = reverse('carDetails', kwargs={'pk': self.first_car.pk})
        response = self.client.put(url, data=self.valid_post2, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_specific_car_error(self):
        def get_object(self, pk):
            try:
                return CarModel.objects.get(pk=pk)
            except CarModel.DoesNotExist:
                raise Http404
        self.assertRaises(Exception, get_object, 3)


class ListCarTest(APITestCase):

    def setUp(self):
        return Category.objects.create(name = 'Car Details')
    
    def test_car_list_data(self):
        url = reverse('list_car')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class AboutCarTest(APITestCase):

    def setUp(self):
        self.valid_data = {
            "location": "Toronto",
            "year": 2022,
            "make": "honda",
            "model": "SUV & Crossovers",
            "transmission": "Automatic",
            "odometer": "50k-100k miles",
            "author": 1
        }
        self.error_data = {
            "year": 2022,
            "model": "SUV & Crossovers",
            "transmission": "Automatic",
            "odometer": "50k-100k miles",
            "author": 1
        }
        self.url = reverse('about_car')
        return Category.objects.create(name = 'About Car')

    def test_post_response_data(self):
        User = get_user_model()
        User.objects.create_user(username='test_user1', password='1234245')
        self.assertTrue(self.client.login(username='test_user1', password='1234245'))
        response = self.client.post(self.url, self.valid_data, format="json", follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
    
    def test_post_respone_data_error(self):
        response = self.client.post(self.url, self.error_data, format='json', follow=True)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class CarAvailabilityTest(APITestCase):
    
    def setUp(self):
        self.valid_data = {
            "notice": "2 hours",
            "shortest_possible_duration": "2 days",
            "longest_possible_duration": "5 days",
            "author": 1
        }

        self.error_data = {
            "shortest_possible_duration": "2 days",
            "longest_possible_duration": "5 days",
            "author": 1
        }

        self.url = reverse('car_availability')
        return Category.objects.create(name='Car Availability')

    def test_post_response_data(self):
        User = get_user_model()
        User.objects.create_user(username='test_user1', password='1234245')
        self.assertTrue(self.client.login(username='test_user1', password='1234245'))
        response = self.client.post(self.url, self.valid_data, format="json", follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
    
    def test_post_respone_data_error(self):
        response = self.client.post(self.url, self.error_data, format='json', follow=True)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)