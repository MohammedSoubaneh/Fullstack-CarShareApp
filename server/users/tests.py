from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from carshare.models import Category
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.urls import reverse


class TestSetUp(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            'email': 'example@example.com',
            'username': 'JohnDoe',
            'password': 'Blessup!12'
        }
        self.same_email_user = {
            'email': 'example@example.com',
            'username': 'JohnDoe2',
            'password': 'Blessup!122'
        }
        self.url = reverse('token_obtain_pair')
        User = get_user_model()
        self.user = User.objects.create_user(email='example@exampl.com',username='user', password='Blessup!13')

        return super().setUp()

    def tearDown(self):
        
        return super().tearDown()


class TestViews(TestSetUp):

    def test_user_cannot_register_with_no_data(self):
        res = self.client.post(self.register_url)
        self.assertEqual(res.status_code, 400)

    def test_user_can_register(self):
        res = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(res.status_code, 201)

    def test_jwt_unauthorized(self):

        self.user.is_active = False
        self.user.save()
        res = self.client.post(self.url, {'email': 'example@exampl.com', 'username': 'user', 'password': 'Blessup!13'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_jwt_authorized(self):
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        res = self.client.post(self.url, {'email': 'example@exampl.com', 'username': 'user', 'password': 'Blessup!13'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue('access' and 'refresh' in res.data)

    def test_user_registration_same_email(self):
        res = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(res.status_code, 201)
        res = self.client.post(self.register_url, self.same_email_user, format="json")
        self.assertEqual(res.status_code, 400)