from django.db import models

from django.contrib.auth.models import User


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
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
    stage = models.CharField(max_length=255, blank=True, null=True)
    benign_sample_diagnosis = models.CharField(max_length=255, blank=True, null=True)
    markers_JSON = models.JSONField(blank=True, null=True)

    def set_markers(self, markers):
        self.markers_JSON = markers

    def get_markers(self):
        return self.markers_JSON
    