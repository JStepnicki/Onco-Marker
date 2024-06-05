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
    path('patients/cancer_samples/update/<int:pk>/', update_cancer_sample, name='update-cancer-sample'),
    path('classify/', classify, name='classify'),
    path('add_doctor/', add_doctor),
    path('register/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('user/', get_user, name='user'),
    path('reset_password/', reset_password, name='reset_password'),
    path('patient/results/<uuid:access_token>/', patient_results, name='patient_results'),
    path('all_results/', get_all_cancer_samples, name='all_results'),
]
