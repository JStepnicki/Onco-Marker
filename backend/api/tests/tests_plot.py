import base64
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import CancerSample

class RadarChartViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Tworzenie przykładowych danych
        self.sample1 = CancerSample.objects.create(
            id=1,
            organ_type='lung',
            markers_JSON={"marker1": 10, "marker2": 20, "marker3": 30},
            diagnosis=1  # Healthy
        )

        self.sample2 = CancerSample.objects.create(
            id=2,
            organ_type='lung',
            markers_JSON={"marker1": 40, "marker2": 50, "marker3": 60},
            diagnosis=3  # Diagnosed Cancer
        )

    def test_radar_chart_view_valid_sample(self):
        url = reverse('radar-chart', args=[self.sample1.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('plot', response.data)

        # Check if the returned plot is a valid base64 encoded string
        try:
            base64.b64decode(response.data['plot'])
        except base64.binascii.Error:
            self.fail('The plot is not a valid base64 encoded string')

    def test_radar_chart_view_invalid_sample(self):
        url = reverse('radar-chart', args=[9999])  # Non-existing sample_id
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
