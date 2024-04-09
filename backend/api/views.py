from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from models import Test, Doctor, Patient, Cancer_Sample
from serializers import TestSerializer, DoctorSerializer, PatientSerializer, CancerSampleSerializer
from rest_framework.decorators import api_view

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

def patient_list(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

def add_patient(request):
    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

def delete_patient(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response(status=404)
    patient.delete()
    return Response(status=204)

def update_patient(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response(status=404)
    serializer = PatientSerializer(patient, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

def cancer_sample_list(request):
    if request.method == 'GET':
        cancer_samples = Cancer_Sample.objects.all()
        serializer = CancerSampleSerializer(cancer_samples, many=True)
        return Response(serializer.data)

def get_patient_cancer_samples(request, pk):
    if request.method == 'GET':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        cancer_samples = patient.cancer_samples.all()
        serializer = CancerSampleSerializer(cancer_samples, many=True)
        return Response(serializer.data)

def add_patient_cancer_sample(request, pk):
    if request.method == 'POST':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        serializer = CancerSampleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            patient.cancer_samples.add(serializer.instance)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)