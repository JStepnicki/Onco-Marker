from api.models import CancerSample
from api.serializers import CancerSampleSerializer, UserSerializer
from django_rest_passwordreset.views import User
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_cancer_sample(request, pk):
    try:
        sample = CancerSample.objects.get(pk=pk)
    except CancerSample.DoesNotExist:
        return Response(status=404)
    serializer = CancerSampleSerializer(sample)
    return Response(serializer.data)


@api_view(['POST'])
def add_cancer_sample(request):
    serializer = CancerSampleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def cancer_sample_list(request):
    cancer_samples = CancerSample.objects.all()
    serializer = CancerSampleSerializer(cancer_samples, many=True)
    return Response(serializer.data)
