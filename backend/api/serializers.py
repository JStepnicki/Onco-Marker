from rest_framework.serializers import ModelSerializer
from api.models import Test

class TestSerializer(ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'title', 'body')