from django.contrib import admin


register = admin.site.register
# Register your models here.

from .models import Patient, CancerSample

register(Patient)
register(CancerSample)