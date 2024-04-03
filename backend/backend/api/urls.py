from rest_framework.routers import DefaultRouter
from api.urls import router_test
from django.urls import path, include

router = DefaultRouter()
router.registry.extend(router_test.registry)

urlpatterns = [
    path('', include(router.urls)),
]
