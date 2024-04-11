from django.db import models
import json




class Patient(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    age = models.IntegerField()
    sex = models.BooleanField()
    


class Doctor(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)


class CancerSample(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    organ_type = models.CharField(max_length=255)
    patient_cohort = models.CharField(max_length=255)
    sample_origin = models.CharField(max_length=255)
    markers_JSON = models.TextField()

    def set_markers(self, markers):
        self.markers_JSON = json.dumps(markers)

    def get_markers(self):
        return json.loads(self.markers_JSON)