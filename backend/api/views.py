from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api.models import Doctor, Patient, CancerSample
from api.serializers import DoctorSerializer, PatientSerializer, CancerSampleSerializer

@api_view(['GET'])
def patient_list(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)


@api_view(['POST'])
def add_patient(request):
    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_patient(request, pk):
    if request.method == 'DELETE':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        patient.delete()
        return Response(status=204)


@api_view(['UPDATE'])
def update_patient(request, pk):
    if request.method == 'UPDATE':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
def cancer_sample_list(request):
    if request.method == 'GET':
        cancer_samples = CancerSample.objects.all()
        serializer = CancerSampleSerializer(cancer_samples, many=True)
        return Response(serializer.data)
    

@api_view(['GET'])
def get_patient_cancer_samples(request, pk):
    if request.method == 'GET':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        serializer = CancerSampleSerializer(patient.cancersample_set.all(), many=True)
        print(serializer.data)
        return Response(serializer.data)


@api_view(['POST'])
def add_patient_cancer_sample(request, pk):
    if request.method == 'POST':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        serializer = CancerSampleSerializer(patient.cancersample_set.all(), many=True)
        if serializer.is_valid():
            serializer.save(patient=patient)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

