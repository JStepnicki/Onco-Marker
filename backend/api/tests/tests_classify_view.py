from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Patient, CancerSample
from django.conf import settings

class TestClassifyView(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.patient = Patient.objects.create(
            id=1,
            email="test@example.com",
            name="test",
            surname="test",
            age=30,
            sex=True
        )

        cls.sample = CancerSample.objects.create(
            id=1,
            diagnosis="1",
            organ_type="lung",
            markers_JSON={"marker1": 10, "marker2": 20}
        )

    @patch('api.views.knn_views.classify_sample')
    @patch('api.models.Patient.objects.get')
    @patch('django.core.mail.send_mail')
    def test_classify_view_valid_data(self, mock_send_mail, mock_get_patient, mock_classify_sample):
        mock_get_patient.return_value = self.patient
        mock_classify_sample.return_value = {"prediction": "cancer"}

        url = reverse('classify')
        data = {
            "sample_id": self.sample.id,
            "organ_type": "lung",
            "patient_id": self.patient.id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("prediction", response.data)
        mock_classify_sample.assert_called_once_with(self.sample.id, "lung")

    @patch('api.models.Patient.objects.get')
    def test_classify_view_patient_not_found(self, mock_get_patient):
        mock_get_patient.side_effect = Patient.DoesNotExist

        url = reverse('classify')
        data = {
            "sample_id": self.sample.id,
            "organ_type": "lung",
            "patient_id": 999  # Non-existing patient_id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    @patch('api.views.knn_views.classify_sample')
    def test_classify_view_missing_sample_id(self, mock_classify_sample):
        url = reverse('classify')
        data = {
            "organ_type": "lung"
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        mock_classify_sample.assert_not_called()

    @patch('api.views.knn_views.classify_sample')
    def test_classify_view_missing_organ_type(self, mock_classify_sample):
        url = reverse('classify')
        data = {
            "sample_id": self.sample.id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        mock_classify_sample.assert_not_called()

    @patch('api.views.knn_views.classify_sample')
    def test_classify_view_no_patient_id(self, mock_classify_sample):
        mock_classify_sample.return_value = {"prediction": "cancer"}

        url = reverse('classify')
        data = {
            "sample_id": self.sample.id,
            "organ_type": "lung"
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("prediction", response.data)
        mock_classify_sample.assert_called_once_with(self.sample.id, "lung")
