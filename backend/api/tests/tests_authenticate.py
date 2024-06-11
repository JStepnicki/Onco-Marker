import json

from api.models import Patient, CancerSample
from api.views import reset_password
from django.contrib.auth.models import User
from django.test import TestCase
from django.test.client import RequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class TestAuthenticate(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.add_patient_url = reverse('add-patient')
        self.patient_list_url = reverse('patient-list')

    def tearDown(self):
        Patient.objects.all().delete()
        CancerSample.objects.all().delete()


    def test_register_valid_data(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_invalid_data(self):
        url = reverse('register')
        data = {
            'username': '',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_register_valid_data(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_valid_credentials(self):
        username = 'testuser'
        password = 'testpassword'
        user = User.objects.create_user(username=username, password=password)

        url = reverse('login')
        data = {
            'username': username,
            'password': password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_invalid_credentials(self):
        # Tworzymy użytkownika bezpośrednio przed testem
        username = 'testuser'
        password = 'testpassword'
        user = User.objects.create_user(username=username, password=password)

        url = reverse('login')
        data = {
            'username': username,
            'password': 'wrongpassword'  # Nieprawidłowe hasło
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_logout(self):
        self.client.login(username='testuser', password='testpassword')

        url = reverse('logout')
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_authenticated(self):
        user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

        url = reverse('user')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_unauthenticated(self):
        url = reverse('user')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_reset_password_valid_email(self):
        client = APIClient()
        factory = RequestFactory()
        url = reverse('reset_password')
        email = 'test@example.com'

        request = factory.post(url, {'email': email})

        request.is_secure = lambda: True

        response = reset_password(request)

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', json.loads(response.content.decode()))

    def test_reset_password_invalid_email(self):
        client = APIClient()
        factory = RequestFactory()
        url = reverse('reset_password')
        email = 'invalid_email'

        request = factory.post(url, {'email': email})

        response = reset_password(request)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', json.loads(response.content.decode()))

