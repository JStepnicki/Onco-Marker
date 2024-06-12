from api.models import Patient
from api.serializers import PatientSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def patient_list(request):
    if request.method == 'GET':

        access_token = request.query_params.get('access_token')

        if access_token:
            patient = get_object_or_404(Patient, access_token=access_token)
            serializer = PatientSerializer(patient)
            return Response(serializer.data)

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


@api_view(['PUT'])
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
