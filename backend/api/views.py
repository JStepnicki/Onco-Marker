import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_200_OK
from rest_framework.viewsets import ModelViewSet
from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate, login, logout
from api.models import Doctor, Patient, CancerSample
from api.serializers import DoctorSerializer, PatientSerializer, CancerSampleSerializer, UserSerializer, UserRegisterSerializer, UserLoginSerializer
from knn.pancreatic_cancer_model import classify_sample
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import PasswordResetForm
# such request to create a doctor, name and surname are optional
# {
#     "user": {
#         "email": "doctor@example.com",
#         "password": "securepassword"
#     },
#     "name": "Doctor Name",
#     "surname": "Doctor Surname"
# }
@api_view(['POST'])
def add_doctor(request):
    if request.method == 'POST':
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


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


@api_view(['GET'])
def cancer_sample_list(request):
    if request.method == 'GET':
        cancer_samples = CancerSample.objects.all()
        serializer = CancerSampleSerializer(cancer_samples, many=True)
        return Response(serializer.data)
    

@api_view(['POST'])
def classify(request):
    try:
        data = json.loads(request.body)
        print(data)
        if data is None:
            return Response({"error": "data not provided"}, status=400)
        result = classify_sample(data)
        return Response(result)
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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
    data = json.loads(request.body)
    print(data)

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

@api_view(['POST'])
def register(request):
    data = request.data
    serializer = UserRegisterSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.create(data)
        if user:
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    data = request.data
    serializer = UserLoginSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.validate(data)
        if user:
            login(request, user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(status=HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response(status=HTTP_200_OK)

@api_view(['GET'])
def get_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=HTTP_200_OK)
    return Response(status=HTTP_401_UNAUTHORIZED)