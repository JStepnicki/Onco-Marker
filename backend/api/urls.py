from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TestViewSet

router_test = DefaultRouter()
router_test.register(r'tests', TestViewSet)
