from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (RegisterView, OculosViewSet, ReservaViewSet, 
                    OculosPublicoViewSet, PasswordResetRequestView, 
                    PasswordResetConfirmView, AdminDashboardView,
                    MyTokenObtainPairView, CreateStaffView,
                    PromoteToStaffByEmailView)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'oculos', OculosViewSet, basename='oculos')
router.register(r'reservas', ReservaViewSet, basename='reservas')
router.register(r'produtos', OculosPublicoViewSet, basename='produtos')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/create-staff/', CreateStaffView.as_view(), name='create_staff'),
    path('api/admin/promote-by-email/<str:email>/', PromoteToStaffByEmailView.as_view(), name='promote_staff_email'),
    path('', include(router.urls)),
]