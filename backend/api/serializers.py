from rest_framework.serializers import ModelSerializer

from models import Doctor, Patient, Cancer_Sample, Test

class TestSerializer(ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'title', 'body')
class DoctorSerializer(ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('id', 'name', 'surname')


class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'name', 'surname', 'age', 'sex', 'cancer_samples')


class CancerSampleSerializer(ModelSerializer):
    class Meta:
        model = Cancer_Sample
        fields = ('id', 'organ_type', 'patient_cohort', 'sample_origin', 'markers_JSON')
