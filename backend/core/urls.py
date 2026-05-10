from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView

urlpatterns = [
    # Cadastro
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Login (Obter Token)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Refresh Token (Para o React renovar o acesso sem pedir senha)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]