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
    path('patients/cancer_samples/<int:pk>/', get_patient_cancer_samples, name='get-patient-cancer-samples'),
    path('patients/cancer_samples/add/<int:pk>/', add_patient_cancer_sample, name='add-patient-cancer-sample'),
    path('patients/cancer_samples/delete/<int:pk>/', delete_cancer_sample, name='delete-cancer-sample'),
    path('classify/', classify, name='classify'),
    path('add_doctor/', add_doctor),
]
