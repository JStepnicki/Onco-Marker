from rest_framework.viewsets import ModelViewSet


from api.models import Test
from api.serializers import TestSerializer

class TestViewSet(ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer 