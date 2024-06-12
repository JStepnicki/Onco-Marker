import uuid

from api.models import Patient, CancerSample
from api.serializers import CancerSampleSerializer
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


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
