import json

from api.models import Patient
from django.conf import settings
from django.core.mail import send_mail
from knn.pancreatic_cancer_model import classify_sample
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def classify(request):
    try:
        data = request.data
        sample_id = data.get('sample_id')
        organ_type = data.get('organ_type')

        if not sample_id:
            return Response({"error": "sample_id is required"}, status=400)
        if not organ_type:
            return Response({"error": "organ_type is required"}, status=400)

        patient_id = data.get('patient_id')
        if patient_id is not None:
            try:
                patient = Patient.objects.get(pk=patient_id)
                access_token = patient.access_token

                subject = "Your Medical Test Results"
                message = f"Dear Patient,\n\nYour medical test results are now available. Please click the following link to view your results: http://localhost:5173/patients/{patient.id}/results/{sample_id}/{access_token}"
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [patient.email]

                send_mail(subject, message, email_from, recipient_list, fail_silently=False)
            except Patient.DoesNotExist:
                return Response({"error": "Patient not found"}, status=404)

        # Assuming classify_sample is defined elsewhere and returns a result
        result = classify_sample(sample_id, organ_type)
        return Response(result)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)
