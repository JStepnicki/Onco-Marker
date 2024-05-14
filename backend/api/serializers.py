from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User

from api.models import Doctor, Patient, CancerSample


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
class DoctorSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Doctor
        fields = ('id', 'name', 'surname')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor




class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'name', 'surname', 'age', 'sex', 'email')



class CancerSampleSerializer(ModelSerializer):
    class Meta:
        model = CancerSample
        fields = ('id', 'patient', 'stage', 'benign_sample_diagnosis' ,'markers_JSON', 'timestamp', 'diagnosis', 'organ_type')
