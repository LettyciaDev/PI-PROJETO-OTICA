from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema
from .models import Oculos, Reserva, ExameAgendamento, ItemCarrinho, OculosVarianteCor
from .serializers import (RegisterSerializer, OculosSerializer, ReservaSerializer,
                          ReservaStatusSerializer, PasswordResetRequestSerializer,
                          PasswordResetConfirmSerializer, MyTokenObtainPairSerializer,
                          StaffRegistrationSerializer, ExameAgendamentoSerializer,
                          ExameStatusSerializer, EmailTokenObtainPairSerializer, 
                          ItemCarrinhoSerializer)
from rest_framework.decorators import action, api_view
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from .permissions import IsAdminUserOnly
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from django.http import HttpResponse
from django.shortcuts import get_object_or_404


class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

    @extend_schema(
        summary="Fazer login com E-mail",
        description="Gera os tokens JWT (Access e Refresh) e retorna o status de Staff do usuário utilizando E-mail e Senha.",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "refresh": {"type": "string"},
                    "access": {"type": "string"},
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                    "is_staff": {"type": "boolean"}
                }
              }
        },
        tags=['Autenticação']
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    

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

class PasswordResetRequestView(views.APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer

    @extend_schema(
        summary="Solicitar recuperação de senha",
        description="Envia um e-mail com UID e Token para o usuário.",
        request={"application/json": {"type": "object", "properties": {"email": {"type": "string"}}}},
        responses={200: {"description": "E-mail enviado com sucesso"}}
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()

        # Por segurança, mesmo que o usuário não exista, retornamos 200
        # para evitar "enumeração de e-mails" por atacantes.
        if user:
            # 1. Gera o UID (ID do usuário em Base64)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # 2. Gera o Token temporário (baseado no estado atual do usuário)
            token = default_token_generator.make_token(user)
            
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password/{uid}/{token}/"
            
            # 4. Envia o e-mail
            subject = "Recuperação de Senha - Minha API"
            message = f"Olá {user.username},\n\nVocê solicitou a alteração de senha. Clique no link abaixo para definir uma nova:\n{reset_url}\n\nSe você não solicitou isso, ignore este e-mail."
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response(
                    {"error": "Erro ao enviar e-mail. Tente novamente mais tarde."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        return Response({"detail": "E-mail de recuperação enviado."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(views.APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Confirmar redefinição de senha",
        description="Recebe o UID, Token e a Nova Senha para atualizar no banco.",
        request=PasswordResetConfirmSerializer,
        responses={200: {"description": "Senha alterada com sucesso"}}
    )
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Senha redefinida com sucesso."}, status=status.HTTP_200_OK)

# redefinir senha no perfil!
class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        senha_atual = request.data.get('senha_atual')
        nova_senha = request.data.get('nova_senha')

        if not senha_atual or not nova_senha:
            return Response(
                {'erro': 'Informe a senha atual e a nova senha.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(senha_atual):
            return Response(
                {'erro': 'Senha atual incorreta.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from django.contrib.auth.password_validation import validate_password
            validate_password(nova_senha, request.user)
        except Exception as e:
            return Response({'erro': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(nova_senha)
        request.user.save()
        return Response({'detail': 'Senha alterada com sucesso.'}, status=status.HTTP_200_OK)

    
#pegar nome completo!
class MeuPerfilView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
        })

    def patch(self, request):
        user = request.user
        full_name = request.data.get("full_name", "").strip()
        email = request.data.get("email", "").strip()

        if full_name:
            partes = full_name.split(" ", 1)
            user.first_name = partes[0]
            user.last_name = partes[1] if len(partes) > 1 else ""

        if email:
            if User.objects.filter(email=email).exclude(pk=user.pk).exists():
                return Response(
                    {"erro": "Este e-mail já está em uso."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.email = email
            user.username = email  

        user.save()

        return Response({
            "username": user.username,
            "email": user.email,
            "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
        }) 
    
# oculos/views.py
class OculosViewSet(viewsets.ModelViewSet):
    queryset = Oculos.objects.all().order_by('-criado_em')
    serializer_class = OculosSerializer
    permission_classes = [IsAdminUser]

class OculosPublicoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Oculos.objects.prefetch_related('variantes__imagens').order_by('-criado_em')
    serializer_class = OculosSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [SearchFilter]                        
    search_fields = ['nome', 'marca', 'formato', 'material']
    
@api_view(['GET'])
def oculos_detalhe(request, slug):
    try:
        oculos = Oculos.objects.prefetch_related(
            'variantes__imagens'          
        ).get(slug=slug)
    except Oculos.DoesNotExist:
        return Response({'erro': 'Produto não encontrado'}, status=status.HTTP_404_NOT_FOUND)
 
    serializer = OculosSerializer(oculos, context={'request': request})  
    return Response(serializer.data)

class CarrinhoViewSet(viewsets.ModelViewSet):
    serializer_class = ItemCarrinhoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItemCarrinho.objects.filter(usuario=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def _get_estoque(self, oculos_id, cor):
        """Retorna quantidade_estoque da variante ou None se não encontrar."""
        try:
            variante = OculosVarianteCor.objects.get(oculos_id=oculos_id, cor=cor)
            return variante.quantidade_estoque
        except OculosVarianteCor.DoesNotExist:
            return None

    def create(self, request, *args, **kwargs):
        oculos_id = request.data.get('oculos')
        cor       = request.data.get('cor', '')
        qtd_nova  = int(request.data.get('quantidade', 1))

        estoque = self._get_estoque(oculos_id, cor)
        if estoque is None:
            return Response(
                {'erro': 'Variante não encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )

        existente = ItemCarrinho.objects.filter(
            usuario=request.user,
            oculos_id=oculos_id,
            cor=cor,
        ).first()

        qtd_atual = existente.quantidade if existente else 0

        if qtd_atual + qtd_nova > estoque:
            return Response(
                {'erro': f'Estoque insuficiente. Disponível: {estoque - qtd_atual}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if existente:
            existente.quantidade += qtd_nova
            existente.save()
            return Response(ItemCarrinhoSerializer(existente).data)

        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        item = self.get_object()
        qtd_nova = request.data.get('quantidade')

        if qtd_nova is not None:
            estoque = self._get_estoque(item.oculos_id, item.cor)
            if estoque is not None and int(qtd_nova) > estoque:
                return Response(
                    {'erro': f'Estoque insuficiente. Disponível: {estoque}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related('usuario').prefetch_related('itens').all()
    serializer_class = ReservaSerializer
    parser_classes = [JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['nome_cliente', 'usuario__username', 'usuario__email']
    ordering_fields = ['criado_em', 'atualizado_em', 'status']
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['create', 'minhas_reservas']:
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        itens_carrinho = ItemCarrinho.objects.filter(usuario=self.request.user)
        
        for item in itens_carrinho:
            try:
                variante = OculosVarianteCor.objects.get(
                    oculos_id=item.oculos_id,
                    cor=item.cor
                )
                variante.quantidade_estoque = max(0, variante.quantidade_estoque - item.quantidade)
                variante.save()
            except OculosVarianteCor.DoesNotExist:
                pass 

        serializer.save(usuario=self.request.user)
        itens_carrinho.delete()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['itens'] = getattr(self, '_itens_data', [])
        return context

    def create(self, request, *args, **kwargs):
        itens_carrinho = ItemCarrinho.objects.filter(usuario=request.user)
        if not itens_carrinho.exists():
            return Response({'erro': 'Carrinho vazio.'}, status=status.HTTP_400_BAD_REQUEST)

        self._itens_data = [
            {
                'oculos': item.oculos,
                'nome': item.nome,
                'cor': item.cor,
                'lentes': item.lentes,
                'quantidade': item.quantidade,
                'preco_unit': item.preco_unit,
            }
            for item in itens_carrinho
        ]
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def atualizar_status(self, request, pk=None):
        reserva = self.get_object()
        serializer = ReservaStatusSerializer(reserva, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ReservaSerializer(reserva, context={'request': request}).data)

    @action(detail=False, methods=['get'], url_path='minhas', permission_classes=[IsAuthenticated])
    def minhas_reservas(self, request):
        reservas = Reserva.objects.filter(usuario=request.user).prefetch_related('itens')
        serializer = ReservaSerializer(reservas, many=True, context={'request': request})
        return Response(serializer.data)
    
# administrador
class AdminDashboardView(views.APIView):
    permission_classes = [IsAdminUserOnly] # Apenas Staff

    @extend_schema(
        summary="Área do Administrador",
        description="Endpoint acessível apenas para usuários com is_staff=True.",
        responses={200: {"description": "Dados sensíveis do painel"}}
    )
    def get(self, request):
        return Response({"message": "Bem-vindo ao painel administrativo!"})

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CreateStaffView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StaffRegistrationSerializer
    permission_classes = [IsAdminUserOnly] # TRAVA DE SEGURANÇA: Só staff entra aqui

    @extend_schema(
        summary="Adicionar novo membro da equipe",
        description="Permite que um administrador cadastre outro usuário com status de Staff.",
        responses={201: StaffRegistrationSerializer}
    )
    def perform_create(self, serializer):
        serializer.save()


class PromoteToStaffByEmailView(views.APIView):
    permission_classes = [IsAdminUserOnly]

    @extend_schema(
        summary="Promover usuário para Staff via E-mail",
        description="Transforma um usuário comum em administrador localizando-o pelo endereço de e-mail.",
        parameters=[
            OpenApiParameter(
                name='email',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description='Endereço de e-mail do usuário a ser promovido',
            )
        ],
        responses={
            200: {"description": "Sucesso", "example": {"detail": "Usuário exemplo@otica.com agora é Staff."}},
            404: {"description": "Não encontrado", "example": {"error": "Usuário com este e-mail não encontrado."}},
            403: {"description": "Proibido", "example": {"detail": "Você não tem permissão."}}
        },
        tags=['Administração']
    )
    def post(self, request, email):
        try:
            # Buscamos pelo campo email
            user = User.objects.get(email=email)
            user.is_staff = True
            user.save()
            return Response(
                {"detail": f"O usuário com e-mail {email} agora possui acesso de Staff."}, 
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Usuário com este e-mail não encontrado."}, 
                status=status.HTTP_404_NOT_FOUND
            )

def servir_arquivo_banco(request, pk):
    """Serve um arquivo armazenado no PostgreSQL."""
    from .models import ArquivoBanco
    arquivo = get_object_or_404(ArquivoBanco, pk=pk)
    response = HttpResponse(
        bytes(arquivo.conteudo),
        content_type=arquivo.content_type
    )
    response['Content-Disposition'] = f'inline; filename="{arquivo.nome}"'
    return response

class ExameAgendamentoViewSet(viewsets.ModelViewSet):
    queryset = ExameAgendamento.objects.select_related('usuario').all()
    serializer_class = ExameAgendamentoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'periodo_preferido']
    search_fields = ['nome_cliente', 'usuario__username', 'usuario__email']
    ordering_fields = ['criado_em', 'data_preferencia', 'status']

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def atualizar_status(self, request, pk=None):
        """
        PATCH /api/exames/{id}/status/
        Admin atualiza status, data confirmada e retorno ao cliente.
        Dispara e-mail + link WhatsApp automaticamente.
        """
        exame = self.get_object()
        serializer = ExameStatusSerializer(exame, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Envia e-mail se houver retorno ao cliente
        if request.data.get('retorno_cliente'):
            self._enviar_email_retorno(exame)

        return Response({
            **ExameAgendamentoSerializer(exame, context={'request': request}).data,
            'whatsapp_url': self._gerar_link_whatsapp(exame)
        })
    
    @action(detail=False, methods=['get'], url_path='meus', permission_classes=[IsAuthenticated])
    def meus_exames(self, request):
        """GET /api/exames/meus/ — retorna só os exames do usuário logado."""
        exames = ExameAgendamento.objects.filter(usuario=request.user)
        serializer = ExameAgendamentoSerializer(exames, many=True, context={'request': request})
        return Response(serializer.data)

    def _enviar_email_retorno(self, exame):
        from django.core.mail import send_mail
        from django.conf import settings

        assunto = f"Atualização do seu agendamento de exame — #{exame.pk}"
        mensagem = (
            f"Olá {exame.nome_cliente},\n\n"
            f"Seu agendamento foi atualizado.\n"
            f"Status: {exame.get_status_display()}\n"
            f"Data confirmada: {exame.data_confirmada or 'A definir'}\n\n"
            f"Mensagem da ótica:\n{exame.retorno_cliente}\n\n"
            f"Em caso de dúvidas, entre em contato conosco."
        )
        try:
            send_mail(
                assunto,
                mensagem,
                settings.DEFAULT_FROM_EMAIL,
                [exame.usuario.email],
                fail_silently=False,
            )
        except Exception:
            pass  # Loga silenciosamente; não quebra a resposta da API

    def _gerar_link_whatsapp(self, exame):
        import urllib.parse
        numero = ''.join(filter(str.isdigit, exame.telefone_whatsapp))
        if len(numero) == 11:  # DDD + número brasileiro
            numero = f"55{numero}"

        mensagem = (
            f"Olá {exame.nome_cliente}! "
            f"Seu agendamento de exame (#{exame.pk}) foi atualizado.\n"
            f"Status: {exame.get_status_display()}\n"
            f"Data confirmada: {exame.data_confirmada or 'A definir'}\n\n"
            f"{exame.retorno_cliente}"
        )
        mensagem_encoded = urllib.parse.quote(mensagem)
        return f"https://wa.me/{numero}?text={mensagem_encoded}"