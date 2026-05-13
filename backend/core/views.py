from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema
from .serializers import RegisterSerializer, OculosSerializer, ReservaSerializer, ReservaStatusSerializer
from .models import Oculos, Reserva
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    @extend_schema(
        summary="Registrar novo usuário",
        description="Cria um novo usuário no sistema para acesso posterior.",
        responses={201: RegisterSerializer}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

# oculos/views.py
class OculosViewSet(viewsets.ModelViewSet):
    queryset = Oculos.objects.all().order_by('-criado_em')
    serializer_class = OculosSerializer
    permission_classes = [IsAdminUser]

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related('usuario', 'oculos').all()
    serializer_class = ReservaSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['nome_cliente', 'usuario__username', 'usuario__email']
    ordering_fields = ['criado_em', 'atualizado_em', 'status']
 
    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsAdminUser()]
 
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
 
    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def atualizar_status(self, request, pk=None):
        """
        PATCH /api/reservas/{id}/status/
        Atualiza apenas o status e observações internas.
        """
        reserva = self.get_object()
        serializer = ReservaStatusSerializer(reserva, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ReservaSerializer(reserva, context={'request': request}).data)