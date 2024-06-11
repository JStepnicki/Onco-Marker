from unittest.mock import patch

from api.models import CancerSample
from django.test import TestCase
from knn.pancreatic_cancer_model import classify_sample


class TestClassifySample(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.sample1 = CancerSample.objects.create(
            diagnosis="1",
            organ_type="test",
            stage = None,
            markers_JSON={
                "marker1": 1.0,
                "marker2": 2.0
            }
        )

        cls.sample2 = CancerSample.objects.create(
            diagnosis="2",
            organ_type="test",
            stage=None,
            markers_JSON={
                "marker1": 2.0,
                "marker2": 3.0
            }
        )

        cls.sample3 = CancerSample.objects.create(
            diagnosis="3",
            stage= "IIIB",
            organ_type="test",
            markers_JSON={
                "marker1": 3.0,
                "marker2": 4.0
            }
        )
        cls.sample9 = CancerSample.objects.create(
            diagnosis="3",
            stage="IIIB",
            organ_type="test",
            markers_JSON={
                "marker1": 3.0,
                "marker2": 4.0
            }
        )
        cls.sample10 = CancerSample.objects.create(
            diagnosis="3",
            stage="IIIB",
            organ_type="test",
            markers_JSON={
                "marker1": 3.0,
                "marker2": 4.0
            }
        )
        cls.sample11 = CancerSample.objects.create(
            diagnosis="3",
            stage="IIIB",
            organ_type="test",
            markers_JSON={
                "marker1": 3.0,
                "marker2": 4.0
            }
        )
        cls.sample4 = CancerSample.objects.create(
            diagnosis="1",
            stage=None,
            organ_type="test",
            markers_JSON={
                "marker1": 4.0,
                "marker2": 5.0
            }
        )

        cls.sample5 = CancerSample.objects.create(
            diagnosis="2",
            stage=None,
            organ_type="test",
            markers_JSON={
                "marker1": 5.0,
                "marker2": 6.0
            }
        )

        cls.sample6 = CancerSample.objects.create(
            diagnosis="1",
            stage=None,
            organ_type="test",
            markers_JSON={
                "marker1": 6.0,
                "marker2": 7.0
            }
        )

    @patch('api.views.CancerSample.objects.get')
    def test_classify_sample_existing_sample(self, mock_get):
        mock_get.return_value = self.sample1
        y_pred, stage_pred = classify_sample(self.sample1.id, "test")
        self.assertEqual(y_pred, "1")
        self.assertIsNone(stage_pred)

    @patch('api.views.CancerSample.objects.get')
    def test_classify_sample_missing_sample(self, mock_get):
        mock_get.side_effect = CancerSample.DoesNotExist
        result = classify_sample(999, "test")
        self.assertIn("error", result)

    @patch('api.views.CancerSample.objects.get')
    def test_classify_sample_diagnosis_3(self, mock_get):
        mock_get.return_value = self.sample3
        y_pred, stage_pred = classify_sample(self.sample3.id, "test")
        self.assertEqual(y_pred, "3")
        self.assertEqual(stage_pred,"IIIB")
