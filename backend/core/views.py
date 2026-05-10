from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Qualquer um pode se cadastrar
    serializer_class = RegisterSerializer

    @extend_schema(
        summary="Registrar novo usuário",
        description="Cria um novo usuário no sistema para acesso posterior.",
        responses={201: RegisterSerializer}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
