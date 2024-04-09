from rest_framework.viewsets import ModelViewSet

from models import Test, Doctor, Patient, Cancer_Sample
from serializers import TestSerializer, DoctorSerializer, PatientSerializer, CancerSampleSerializer


class TestViewSet(ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer


class DoctorViewSet(ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class PatientViewSet(ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class CancerSampleViewSet(ModelViewSet):
    queryset = Cancer_Sample.objects.all()
    serializer_class = CancerSampleSerializer
