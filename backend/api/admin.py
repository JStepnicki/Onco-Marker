from django.contrib import admin


register = admin.site.register
# Register your models here.

from .models import Patient, CancerSample, Doctor

register(Patient)
register(CancerSample)
register(Doctor)