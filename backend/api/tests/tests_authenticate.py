from api.models import Patient, CancerSample
from django.contrib.auth.models import User
from django.test import TestCase
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

    def test_register_existing_email(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        data1 = {
            'username': 'testuser1',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        self.client.post(url, data, format='json')
        response1 = self.client.post(url, data1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_400_BAD_REQUEST)



    def test_register_invalid_data(self):
        url = reverse('register')
        data = {
            'username': '',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_valid_credentials(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')

        url = reverse('login')
        data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # def test_login_invalid_credentials(self):
    #     url = reverse('register')
    #     data = {
    #         'username': 'testuser',
    #         'email': 'test@example.com',
    #         'password': 'testpassword'
    #     }
    #     self.client.post(url, data, format='json')
    #
    #     url1 = reverse('login')
    #     data = {
    #         'email': 'test@example.com',
    #         'password': 'wrongpassword'  # Nieprawidłowe hasło
    #     }
    #     response = self.client.post(url1, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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

    def test_create_user_with_valid_email_and_password(self):
        email = 'test@example.com'
        password = 'testpassword'
        username = 'testuser'
        user = User.objects.create_user(email=email, password=password, username=username)

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    # def test_create_user_without_email(self):
    #     with self.assertRaises(ValueError) as context:
    #         User.objects.create_user(email='', password='testpassword', username='testuser')
    #     self.assertTrue('The Email field must be set' in str(context.exception))
    #
    # def test_create_user_without_password(self):
    #     with self.assertRaises(ValueError) as context:
    #         User.objects.create_user(email='test@example.com', password='', username='testuser')
    #
    #     self.assertEqual(str(context.exception), 'The Password field must be set')

    def test_create_user_with_normalized_email(self):
        email = 'test@Example.com'
        password = 'testpassword'
        username = 'testuser'
        user = User.objects.create_user(email=email, password=password, username=username)

        self.assertEqual(user.email, 'test@example.com')

