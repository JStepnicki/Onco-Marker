from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api.views import *

router = DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    path('patients/', patient_list, name='patient-list'),
    path('patients/add/', add_patient, name='add-patient'),
    path('patients/<int:pk>/delete/', delete_patient, name='delete-patient'),
    path('patients/<int:pk>/update/', update_patient, name='update-patient'),
    path('cancer_samples/', cancer_sample_list, name='cancer-sample-list'),
    path('patients/<int:pk>/cancer_samples/', get_patient_cancer_samples, name='get-patient-cancer-samples'),
    path('patients/<int:pk>/cancer_samples/add/', add_patient_cancer_sample, name='add-patient-cancer-sample'),
]