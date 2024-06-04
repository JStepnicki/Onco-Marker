import uuid
from django.db import models

from django.contrib.auth.models import User, AbstractUser
from django.contrib.auth.base_user import BaseUserManager


class Patient(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    age = models.IntegerField()
    sex = models.BooleanField()
    access_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)




class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True, null=True)
    surname = models.CharField(max_length=255, blank=True, null=True)


class CancerSample(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    organ_type = models.CharField(max_length=255)
    stage = models.CharField(max_length=255, blank=True, null=True)
    benign_sample_diagnosis = models.CharField(max_length=255, blank=True, null=True)
    markers_JSON = models.JSONField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    diagnosis = models.CharField(max_length=255, blank=True, null=True)

    def set_markers(self, markers):
        self.markers_JSON = markers

    def get_markers(self):
        return self.markers_JSON


class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not password:
            raise ValueError('The Password field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not password:
            raise ValueError('The Password field must be set')
        user = self.create_user(email, password)
        user.is_superuser = True
        user.save()
        return user

