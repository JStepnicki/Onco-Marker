from api.models import Patient
from api.serializers import CancerSampleSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def patient_results(request, access_token):
    if request.method == 'GET':
        patient = get_object_or_404(Patient, access_token=access_token)
        cancer_samples = patient.cancersample_set.all()
        serializer = CancerSampleSerializer(cancer_samples, many=True)
        return Response(serializer.data)
