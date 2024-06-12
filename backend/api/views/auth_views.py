from api.serializers import UserSerializer, UserRegisterSerializer, UserLoginSerializer
from django.contrib.auth import login, logout
from django_rest_passwordreset.views import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_200_OK
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created

@api_view(['POST'])
def register(request):
    data = request.data
    serializer = UserRegisterSerializer(data=data)
    email = data.get('email')
    if email and User.objects.filter(email=email).exists():
        return Response({'error': 'User with this email already exists'}, status=HTTP_400_BAD_REQUEST)
    if serializer.is_valid(raise_exception=True):
        user = serializer.create(data)
        if user:
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def user_login(request):
    data = request.data
    serializer = UserLoginSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.validate(data)
        if user:
            login(request, user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(status=HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_logout(request):
    logout(request)
    return Response(status=HTTP_200_OK)


@api_view(['GET'])
def get_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=HTTP_200_OK)
    return Response(status=HTTP_401_UNAUTHORIZED)


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    context = {
        'username': reset_password_token.user.username,
        'reset_password_token': reset_password_token.key
    }

    email_html_message = render_to_string('user_reset_password.html', context)
    email_plaintext_message = render_to_string('user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        "Resetowanie hasła",
        email_plaintext_message,
        "noreply@example.com",
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
