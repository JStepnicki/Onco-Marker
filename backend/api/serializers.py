from api.models import Patient, CancerSample
from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

UserModel = get_user_model()
class UserSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username')

class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'name', 'surname', 'age', 'sex', 'email')



class CancerSampleSerializer(ModelSerializer):
    class Meta:
        model = CancerSample
        fields = ('id', 'patient', 'stage', 'benign_sample_diagnosis' ,'markers_JSON', 'timestamp', 'diagnosis', 'organ_type')

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



