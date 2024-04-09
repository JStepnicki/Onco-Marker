from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TestViewSet, DoctorViewSet, PatientViewSet, CancerSampleViewSet

router = DefaultRouter()
router.register(r'tests', TestViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'cancer_samples', CancerSampleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]