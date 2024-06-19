import json

from api.models import Patient, CancerSample
from api.serializers import CancerSampleSerializer
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class TestSample(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.add_patient_url = reverse('add-patient')
        self.patient_list_url = reverse('patient-list')

    def tearDown(self):
        Patient.objects.all().delete()
        CancerSample.objects.all().delete()

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

    def test_add_and_get_single_cancer_sample(self):
        sample_data = {
            'stage': "Stage I",
            'benign_sample_diagnosis': "Diagnosis A",
            'markers_JSON': {'marker1': 'value1'},
            'diagnosis': "Diagnosis X",
            'organ_type': "Liver"
        }

        add_url = reverse('add-cancer-sample')
        response = self.client.post(add_url, sample_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        sample_id = response.data['id']

        get_url = reverse('get-cancer-sample', args=[sample_id])

        response = self.client.get(get_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=CancerSample.objects.get(pk=sample_id)).data

        self.assertEqual(data, expected_data)

    def test_get_single_cancer_sample_not_found(self):
        url = reverse('cancer-sample-list')
        response = self.client.get(url, {})
        self.assertEqual(len(response.data), 0)

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

        url = reverse('cancer-sample-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data

        expected_data = CancerSampleSerializer(instance=[sample1, sample2], many=True).data
        self.assertEqual(data, expected_data)

    def test_set_markers(self):
        patient = Patient.objects.create(name='John', surname='Doe', age=33, sex=1,  email='john.doe@example.com')
        sample1 = CancerSample.objects.create(patient=patient, stage="", benign_sample_diagnosis="", markers_JSON={},
                                              diagnosis="", organ_type="")

        markers = {'marker1': 'value1'}
        sample1.set_markers(markers)
        self.assertEqual(sample1.markers_JSON, markers)
