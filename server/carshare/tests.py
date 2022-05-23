from django.urls import include, path, reverse
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth import logout
from django.http import Http404
from .models import CarModel, Category
from rest_framework import status
from rest_framework.test import APITestCase, URLPatternsTestCase




class CategoryTest(TestCase):

    def test_category_model_field(self):
        category = Category(name = 'Car Details')
        self.assertEqual(category.name, 'Car Details')
        self.assertEqual(str(category), category.name)

class CarModelTest(TestCase):

    def test_car_model_fields(self):

        category = Category(name ='Car Details')

        car = CarModel(
            category = category,
            name='Honda Civic', 
            year=2019, 
            rating=10, 
            trips=10,
            safetyCheck=True, 
            freeDelivery=True, 
            cost=100)

        self.assertEqual(car.category, category)
        self.assertEqual(car.name, "Honda Civic")
        self.assertEqual(car.year, 2019)
        self.assertEqual(car.rating, 10)
        self.assertEqual(car.trips, 10)
        self.assertTrue(car.safetyCheck)
        self.assertTrue(car.freeDelivery)
        self.assertEqual(car.cost, 100)
        self.assertEqual(str(car), car.name)


class CarShareHomePage(APITestCase):

    def setUp(self):
        return Category.objects.create(name = 'Car Details')


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
            'author': 2
        }

    def test_retrieve_specific_car(self):
        url = reverse('carDetails', kwargs={'pk': self.first_car.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"id": 1, "name": "Toyota", "year": 2020, "rating": 8, 'author': 1})

    def test_update_specific_car(self):
        url = reverse('carDetails', kwargs={'pk': self.first_car.pk})
        response = self.client.put(url, data=self.valid_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'id': 1, 'name': 'Honda', 'year': 2022, 'rating': 10, 'author': 1})

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
