from rest_framework import serializers
from django.forms import UUIDField
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User

from api.models import Doctor, Patient, CancerSample
from django.contrib.auth import get_user_model, authenticate

UserModel = get_user_model()
class UserSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username')
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



class CancerSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancerSample
        fields = ['patient', 'organ_type', 'stage', 'benign_sample_diagnosis', 'markers_JSON', 'diagnosis']
        extra_kwargs = {
            'organ_type': {'required': True},
        }

class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email','username', 'password')

    def create(self, validated_data):
        user = UserModel.objects.create_user(email=validated_data['email'], password=validated_data['password'], username=validated_data['username'])
        user.save()
        return user
class UserLoginSerializer(ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()
    class Meta:
        model = UserModel
        fields = ('username', 'password')

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")



