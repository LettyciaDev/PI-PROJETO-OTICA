from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, OculosViewSet, ReservaViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'oculos', OculosViewSet, basename='oculos')
router.register(r'reservas', ReservaViewSet, basename='reservas')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]