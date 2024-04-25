from rest_framework.serializers import ModelSerializer

from api.models import Doctor, Patient, CancerSample

class DoctorSerializer(ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('id', 'name', 'surname')


class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'name', 'surname', 'age', 'sex')


class CancerSampleSerializer(ModelSerializer):
    class Meta:
        model = CancerSample
        fields = ('id', 'patient', 'stage', 'benign_sample_diagnosis' ,'markers_JSON')
