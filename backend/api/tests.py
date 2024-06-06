import json
import random
import uuid
from unittest.mock import patch

from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordResetForm
from django.test.client import RequestFactory
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Patient, CancerSample
from api.serializers import CancerSampleSerializer
from api.views import reset_password

class TestPatientViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.add_patient_url = reverse('add-patient')
        self.patient_list_url = reverse('patient-list')




    def tearDown(self):
        Patient.objects.all().delete()
        CancerSample.objects.all().delete()

    def test_add_patient(self):
        patient_data = {
            "name": "John",
            "surname": "Doe",
            "age": 30,
            "sex": 1,
            "email": "john.doe@example.com"
        }

        response = self.client.post(reverse('add-patient'), data=patient_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Patient.objects.count(), 1)
        patient = Patient.objects.first()
        self.assertEqual(patient.name, 'John')
        self.assertEqual(patient.surname, 'Doe')
        self.assertEqual(patient.age, 30)
        self.assertEqual(patient.sex, 1)
        self.assertEqual(patient.email, 'john.doe@example.com')

    def test_delete_patient(self):
        patient_data = {
            "name": "John",
            "surname": "Doe",
            "age": 30,
            "sex": 1,
            "email": "john.doe@example.com"
        }

        response = self.client.post(reverse('add-patient'), data=patient_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Patient.objects.count(), 1)

        patient_id = response.json()['id']

        delete_patient_url = reverse('delete-patient', kwargs={'pk': patient_id})

        response = self.client.delete(delete_patient_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertEqual(Patient.objects.count(), 0)

    def test_update_patient(self):
        patient_data = {
            "name": "John",
            "surname": "Doe",
            "age": 30,
            "sex": 1,
            "email": "john.doe@example.com"
        }
        response = self.client.post(reverse('add-patient'), data=patient_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        patient_id = response.json()['id']

        updated_patient_data = {
            "name": "Jane",
            "surname": "Smith",
            "age": 35,
            "sex": 0,  # Assuming 0 for female
            "email": "jane.smith@example.com"
        }

        update_patient_url = reverse('update-patient', kwargs={'pk': patient_id})
        response = self.client.put(update_patient_url, data=updated_patient_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_patient = Patient.objects.get(pk=patient_id)

        self.assertEqual(updated_patient.name, 'Jane')
        self.assertEqual(updated_patient.surname, 'Smith')
        self.assertEqual(updated_patient.age, 35)
        self.assertEqual(updated_patient.sex, 0)
        self.assertEqual(updated_patient.email, 'jane.smith@example.com')

    def test_patient_list_without_access_token(self):
            patient1 = Patient.objects.create(name='John', surname='Doe', age=30, sex=1, email='john.doe@example.com')
            patient2 = Patient.objects.create(name='Jane', surname='Smith', age=35, sex=0,
                                              email='jane.smith@example.com')

            response = self.client.get(self.patient_list_url)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            response_data = response.json()
            self.assertEqual(len(response_data), 2)
            self.assertEqual(response_data[0]['name'], 'John')
            self.assertEqual(response_data[1]['name'], 'Jane')

    def test_patient_list_with_access_token(self):
            patient = Patient.objects.create(name='John', surname='Doe', age=30, sex=1, email='john.doe@example.com')

            access_token = uuid.uuid4()
            patient.access_token = access_token
            patient.save()

            patient_list_with_token_url = f"{self.patient_list_url}?access_token={access_token}"

            response = self.client.get(patient_list_with_token_url)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            response_data = response.json()
            self.assertEqual(response_data['name'], 'John')
            self.assertEqual(response_data['surname'], 'Doe')
            self.assertEqual(response_data['age'], 30)
            self.assertEqual(response_data['sex'], 1)
            self.assertEqual(response_data['email'], 'john.doe@example.com')

    def test_add_patient_cancer_sample(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')

        data = {
            "organ_type": "pancreas",
            "stage": "",
            "benign_sample_diagnosis": "",
            "markers_JSON": {
                "plasma_CA19_9": 11.7,
                "creatinine": 1.83222,
                "LYVE1": 0.8932192,
                "REG1B": 52.94884,
                "TFF1": 654.282174,
                "REG1A": 1262
            },
            "diagnosis": ""
        }
        self.add_patient_cancer_sample_url = reverse('add-patient-cancer-sample', kwargs={'pk': patient.pk})

        response = self.client.post(self.add_patient_cancer_sample_url, data=json.dumps(data),
                                    content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(CancerSample.objects.filter(patient=patient).exists())

        cancer_sample = CancerSample.objects.get(patient=patient)

        self.assertEqual(cancer_sample.organ_type, "pancreas")
        self.assertEqual(cancer_sample.stage, "")
        self.assertEqual(cancer_sample.benign_sample_diagnosis, "")
        self.assertEqual(cancer_sample.diagnosis, "")
        self.assertEqual(cancer_sample.markers_JSON["plasma_CA19_9"], 11.7)
        self.assertEqual(cancer_sample.markers_JSON["creatinine"], 1.83222)
        self.assertEqual(cancer_sample.markers_JSON["LYVE1"], 0.8932192)
        self.assertEqual(cancer_sample.markers_JSON["REG1B"], 52.94884)
        self.assertEqual(cancer_sample.markers_JSON["TFF1"], 654.282174)
        self.assertEqual(cancer_sample.markers_JSON["REG1A"], 1262)


    def test_add_patient_cancer_sample_patient_not_found(self):
        non_existent_patient_id = 99999

        data = {
            "organ_type": "pancreas",
            "stage": "",
            "benign_sample_diagnosis": "",
            "markers_JSON": {
                "plasma_CA19_9": 11.7,
                "creatinine": 1.83222,
                "LYVE1": 0.8932192,
                "REG1B": 52.94884,
                "TFF1": 654.282174,
                "REG1A": 1262
            },
            "diagnosis": ""
        }

        self.add_patient_cancer_sample_url = reverse('add-patient-cancer-sample',
                                                     kwargs={'pk': non_existent_patient_id})

        response = self.client.post(self.add_patient_cancer_sample_url, data=json.dumps(data),
                                    content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_cancer_sample(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')
        sample = CancerSample.objects.create(patient=patient, organ_type="pancreas", stage="",
                                             benign_sample_diagnosis="", markers_JSON={}, diagnosis="")

        delete_cancer_sample_url = reverse('delete-cancer-sample', kwargs={'pk': sample.pk})

        response = self.client.delete(delete_cancer_sample_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(CancerSample.objects.filter(pk=sample.pk).exists())

    def test_delete_cancer_sample_not_found(self):
        non_existent_sample_id = 99999

        delete_cancer_sample_url = reverse('delete-cancer-sample', kwargs={'pk': non_existent_sample_id})

        response = self.client.delete(delete_cancer_sample_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_cancer_sample(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')
        sample = CancerSample.objects.create(patient=patient, organ_type="pancreas", stage="",
                                             benign_sample_diagnosis="", markers_JSON={}, diagnosis="")

        updated_data = {
            "patient": patient.pk,
            "organ_type": "liver",
            "stage": "II",
            "benign_sample_diagnosis": "None",
            "markers_JSON": {
                "plasma_CA19_9": 20.5,
                "creatinine": 1.2,
                "LYVE1": 0.5,
                "REG1B": 45.0,
                "TFF1": 600.0,
                "REG1A": 1200
            },
            "diagnosis": "Updated diagnosis"
        }

        update_cancer_sample_url = reverse('update-cancer-sample', kwargs={'pk': sample.pk})

        response = self.client.put(update_cancer_sample_url, data=json.dumps(updated_data),
                                   content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        sample.refresh_from_db()

        self.assertEqual(sample.organ_type, "liver")
        self.assertEqual(sample.stage, "II")
        self.assertEqual(sample.benign_sample_diagnosis, "None")
        self.assertEqual(sample.markers_JSON, {
            "plasma_CA19_9": 20.5,
            "creatinine": 1.2,
            "LYVE1": 0.5,
            "REG1B": 45.0,
            "TFF1": 600.0,
            "REG1A": 1200
        })
        self.assertEqual(sample.diagnosis, "Updated diagnosis")

    def test_update_cancer_sample_not_found(self):
        non_existent_sample_id = 99999

        updated_data = {
            "organ_type": "liver",
            "stage": "II",
            "benign_sample_diagnosis": "None",
            "markers_JSON": {
                "plasma_CA19_9": 20.5,
                "creatinine": 1.2,
                "LYVE1": 0.5,
                "REG1B": 45.0,
                "TFF1": 600.0,
                "REG1A": 1200
            },
            "diagnosis": "Updated diagnosis"
        }

        update_cancer_sample_url = reverse('update-cancer-sample', kwargs={'pk': non_existent_sample_id})

        response = self.client.put(update_cancer_sample_url, data=json.dumps(updated_data),
                                   content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_cancer_samples_list(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')
        sample1 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")
        sample2 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")

        url = reverse('cancer-sample-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=[sample1, sample2], many=True).data
        self.assertEqual(data, expected_data)

    def test_get_single_cancer_sample(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')
        sample = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                             diagnosis="", organ_type="")

        url = reverse('cancer-sample-list')

        response = self.client.get(url, {'sample_id': sample.pk})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=sample).data
        self.assertEqual(data, expected_data)

    def test_get_single_cancer_sample_not_found(self):
        url = reverse('cancer-sample-list')

        response = self.client.get(url, {'sample_id': 9999})

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_patient_cancer_samples(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')
        sample1 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")
        sample2 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")

        url = reverse('get-patient-cancer-samples', kwargs={'pk': patient.pk})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=[sample1, sample2], many=True).data
        self.assertEqual(data, expected_data)

    def test_get_patient_cancer_samples_not_found(self):
        url = reverse('get-patient-cancer-samples', kwargs={'pk': 9999})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_cancer_samples(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')

        sample1 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={}, diagnosis="", organ_type="")
        sample2 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={}, diagnosis="", organ_type="")

        url = reverse('all_results')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=[sample1, sample2], many=True).data
        self.assertEqual(data, expected_data)

    def test_patient_results(self):
        access_token = uuid.uuid4()

        patient = Patient.objects.create(
            access_token=access_token,
            age=30,
            sex=1
        )

        sample1 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")
        sample2 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")

        url = reverse('patient_results', kwargs={'access_token': access_token})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=[sample1, sample2], many=True).data

        self.assertEqual(data, expected_data)

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
        # Tworzymy użytkownika bezpośrednio przed testem
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


