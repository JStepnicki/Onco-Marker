import json

from api.models import Patient, CancerSample
from api.serializers import CancerSampleSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def get_patient_cancer_samples(request, pk):
    if request.method == 'GET':
        try:
            patient = Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return Response(status=404)
        serializer = CancerSampleSerializer(patient.cancersample_set.all(), many=True)
        return Response(serializer.data)


@api_view(['POST'])
def add_patient_cancer_sample(request, pk):
    data = json.loads(request.body)
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response(status=404)

    data['patient'] = patient.id

    serializer = CancerSampleSerializer(data=data)
    if serializer.is_valid():
        serializer.save(patient=patient)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_cancer_sample(request, pk):
    try:
        sample = CancerSample.objects.get(pk=pk)
    except CancerSample.DoesNotExist:
        return Response(status=404)

    sample.delete()
    return Response(status=204)


@api_view(['PUT'])
def update_cancer_sample(request, pk):
    try:
        sample = CancerSample.objects.get(pk=pk)
    except CancerSample.DoesNotExist:
        return Response(status=404)

    data = json.loads(request.body)

    serializer = CancerSampleSerializer(sample, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    print(serializer.errors)
    return Response(serializer.errors, status=400)
