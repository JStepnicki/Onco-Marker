from api.views.auth_views import *
from api.views.debug_views import *
from api.views.patients_view import *
from api.views.result_views import *
from api.views.knn_views import *
from api.views.patients_samples_views import *
from api.views.plot_views import *
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),

    #patients
    path('patients/', patient_list, name='patient-list'),
    path('patients/add/', add_patient, name='add-patient'),
    path('patients/<int:pk>/delete/', delete_patient, name='delete-patient'),
    path('patients/<int:pk>/update/', update_patient, name='update-patient'),

    #patients cancer samples
    path('patients/cancer_samples/<int:pk>/', get_patient_cancer_samples, name='get-patient-cancer-samples'),
    path('patients/cancer_samples/add/<int:pk>/', add_patient_cancer_sample, name='add-patient-cancer-sample'),
    path('patients/cancer_samples/delete/<int:pk>/', delete_cancer_sample, name='delete-cancer-sample'),
    path('patients/cancer_samples/update/<int:pk>/', update_cancer_sample, name='update-cancer-sample'),

    #knn
    path('classify/', classify, name='classify'),

    #authentication
    path('register/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('user/', get_user, name='user'),

    #patient results
    path('patient/results/<uuid:access_token>/', patient_results, name='patient_results'),

    #password reset from django_rest_passwordreset
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('password_reset/confirm/', include('django_rest_passwordreset.urls', namespace='password_reset_confirm')),
    path('password_reset/validate_token/', include('django_rest_passwordreset.urls', namespace='password_reset_validate_token')),



    #debugging not used in frontend
    path('users/', get_all_users, name='get_all_users'),
    path('cancer_sample/<int:pk>/', get_cancer_sample, name='get-cancer-sample'),
    path('cancer_samples/', cancer_sample_list, name='cancer-sample-list'),
    path('cancer_saples_add/', add_cancer_sample, name='add-cancer-sample'), # for adding cancer samples without patient

    path('plot/<int:sample_id>/', radar_chart_view, name='radar-chart')
]
