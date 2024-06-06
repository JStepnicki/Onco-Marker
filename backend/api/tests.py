import json
import uuid

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Patient, CancerSample

class TestPatientViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.add_patient_url = reverse('add-patient')
        self.patient_list_url = reverse('patient-list')




    def tearDown(self):
        Patient.objects.all().delete()

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
        # Dodajemy pacjenta do bazy danych
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1, email='john.doe@example.com')

        # Dane próbki nowotworowej
        data = {
            "organ_type": "pancreas",
            "stage": "",  # Brak informacji o stadium w przykładzie
            "benign_sample_diagnosis": "",  # Brak informacji o diagnozie próbki benignnej w przykładzie
            "markers_JSON": {
                "plasma_CA19_9": 11.7,
                "creatinine": 1.83222,
                "LYVE1": 0.8932192,
                "REG1B": 52.94884,
                "TFF1": 654.282174,
                "REG1A": 1262
            },
            "diagnosis": ""  # Brak informacji o diagnozie w przykładzie
        }
        # Tutaj przekazujemy patient.pk jako argument pk
        self.add_patient_cancer_sample_url = reverse('add-patient-cancer-sample', kwargs={'pk': patient.pk})

        # Wysyłanie żądania POST z danymi próbki nowotworowej
        response = self.client.post(self.add_patient_cancer_sample_url, data=json.dumps(data),
                                    content_type='application/json')

        # Sprawdzanie czy status odpowiedzi to 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Sprawdzanie czy próbka nowotworowa została dodana do pacjenta
        self.assertTrue(CancerSample.objects.filter(patient=patient).exists())

        # Pobieranie dodanej próbki nowotworowej
        cancer_sample = CancerSample.objects.get(patient=patient)

        # Sprawdzanie czy dane próbki nowotworowej się zgadzają
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