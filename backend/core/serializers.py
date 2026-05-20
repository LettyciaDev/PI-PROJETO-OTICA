from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Oculos, OculosVarianteCor, OculosImagem, Reserva, ExameAgendamento, ItemCarrinho, ItemReserva
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(write_only=True, required=True, max_length=150)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'full_name')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def create(self, validated_data):
        # 1. Remove full_name from validated_data safely
        full_name = validated_data.pop('full_name', '').strip()
        
        # 2. Logic to split full_name into first_name and last_name
        first_name = ""
        last_name = ""
        if full_name:
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            if len(parts) > 1:
                last_name = parts[1]

        # 3. Use create_user so the password gets properly hashed
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        # 4. CRITICAL: Return the created user instance
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Não há usuário cadastrado com este e-mail.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        help_text="A nova senha deve atender aos requisitos de complexidade."
    )

    def validate(self, data):
        try:
            uid = urlsafe_base64_decode(data['uid']).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "ID de usuário inválido."})

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError({"token": "Token inválido ou expirado."})

        self.user = user
        return data

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()
        return self.user

class OculosImagemSerializer(serializers.ModelSerializer):
    """Serializa cada imagem de uma variante, gerando URL absoluta."""
    imagem = serializers.SerializerMethodField()

    class Meta:
        model = OculosImagem
        fields = ['id', 'imagem', 'e_principal']

    def get_imagem(self, obj):
        request = self.context.get('request')
        if obj.imagem and request:
            return request.build_absolute_uri(obj.imagem.url)
        # Fallback: URL relativa caso não haja request no contexto
        return obj.imagem.url if obj.imagem else None


class OculosVarianteCorSerializer(serializers.ModelSerializer):
    """Serializa cada variante de cor com suas imagens aninhadas."""
    imagens = OculosImagemSerializer(many=True, read_only=True)

    class Meta:
        model = OculosVarianteCor
        fields = ['id', 'cor', 'quantidade_estoque', 'preco_adicional', 'imagens']


class OculosSerializer(serializers.ModelSerializer):
    """Serializer principal do óculos — inclui variantes completas."""
    variantes = OculosVarianteCorSerializer(many=True, read_only=True)

    class Meta:
        model = Oculos
        fields = [
            'id', 'codigo_referencia', 'nome', 'slug', 'marca', 'material',
            'formato', 'genero', 'medida_aro', 'medida_ponte', 'medida_haste',
            'preco', 'criado_em', 'variantes',
        ]
        read_only_fields = ['criado_em', 'slug']

    def validate_codigo_referencia(self, value):
        if value <= 0:
            raise serializers.ValidationError("O código de referência deve ser positivo.")
        return value

    def validate_preco(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate(self, data):
        for campo in ['medida_aro', 'medida_ponte', 'medida_haste']:
            if data.get(campo, 0) <= 0:
                raise serializers.ValidationError({campo: "A medida deve ser maior que zero."})
        return data

# serializer do CARRINHO!
class ItemCarrinhoSerializer(serializers.ModelSerializer):
    imagem_url = serializers.SerializerMethodField()

    class Meta:
        model = ItemCarrinho
        fields = '__all__'
        read_only_fields = ['usuario', 'adicionado_em']

    def get_imagem_url(self, obj):
        if not obj.imagem:
            return None
        if obj.imagem.startswith('http'):
            return obj.imagem
        try:
            from .db_storage import DatabaseStorage
            storage = DatabaseStorage()
            caminho_relativo = storage.url(obj.imagem)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(caminho_relativo)
            return f"http://localhost:8000{caminho_relativo}"
        except Exception:
            return None

EXTENSOES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.pdf', '.docx']


class UsuarioResumoSerializer(serializers.ModelSerializer):
    nome_completo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome_completo']

    def get_nome_completo(self, obj):
        return obj.get_full_name() or obj.username

class ItemReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemReserva
        fields = ['oculos', 'nome', 'cor', 'lentes', 'quantidade', 'preco_unit']

class ReservaSerializer(serializers.ModelSerializer):
    itens = ItemReservaSerializer(many=True, read_only=True)
    usuario_detalhe = UsuarioResumoSerializer(source='usuario', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'
        read_only_fields = ['criado_em', 'atualizado_em', 'oculos_snapshot', 'usuario']

    def create(self, validated_data):
        itens_data = self.context.get('itens', [])

        validated_data['oculos_snapshot'] = [
            {
                'nome': i['nome'],
                'cor': i['cor'],
                'lentes': i['lentes'],
                'quantidade': i['quantidade'],
                'preco_unit': str(i['preco_unit']),
            }
            for i in itens_data
        ]

        reserva = Reserva.objects.create(**validated_data)

        for item in itens_data:
            ItemReserva.objects.create(reserva=reserva, **item)

        return reserva


class ReservaStatusSerializer(serializers.ModelSerializer):
    """Usado exclusivamente para o admin atualizar status + obs. internas."""
    class Meta:
        model = Reserva
        fields = ['status', 'observacoes_admin']

    def validate_status(self, value):
        VALIDOS = [s[0] for s in Reserva.STATUS_CHOICES]
        if value not in VALIDOS:
            raise serializers.ValidationError(f"Status inválido. Opções: {VALIDOS}")
        return value

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_staff'] = self.user.is_staff
        return data

class StaffRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(write_only=True, required=True, max_length=150)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'full_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_staff=True
        )
        return user

class ExameAgendamentoSerializer(serializers.ModelSerializer):
    usuario_detalhe = UsuarioResumoSerializer(source='usuario', read_only=True)

    class Meta:
        model = ExameAgendamento
        fields = '__all__'
        read_only_fields = ['criado_em', 'atualizado_em', 'usuario',
                            'status', 'data_confirmada', 'observacoes_admin', 'retorno_cliente']

    def validate_data_preferencia(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("A data de preferência não pode ser no passado.")
        return value

    def validate_telefone_whatsapp(self, value):
        import re
        limpo = re.sub(r'\D', '', value)
        if len(limpo) < 10 or len(limpo) > 11:
            raise serializers.ValidationError("Informe um número de WhatsApp válido com DDD.")
        return value


class ExameStatusSerializer(serializers.ModelSerializer):
    """Usado exclusivamente pelo admin para atualizar status, data confirmada e retorno."""
    class Meta:
        model = ExameAgendamento
        fields = ['status', 'data_confirmada', 'observacoes_admin', 'retorno_cliente']

    def validate_status(self, value):
        VALIDOS = [s[0] for s in ExameAgendamento.STATUS_CHOICES]
        if value not in VALIDOS:
            raise serializers.ValidationError(f"Status inválido. Opções: {VALIDOS}")
        return value

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Definimos explicitamente que o identificador é o e-mail
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove o campo username padrão para não confundir o Swagger/Front
        if 'username' in self.fields:
            del self.fields['username']

    def validate(self, attrs):
        # Captura os dados brutos enviados no JSON
        email_input = attrs.get("email")
        password_input = attrs.get("password")

        # Forçamos o authenticate a receber o e-mail tanto no parâmetro username
        # quanto no parâmetro email, para funcionar com qualquer configuração de backend
        user = authenticate(
            request=self.context.get('request'), 
            username=email_input, 
            email=email_input, 
            password=password_input
        )

        if not user:
            raise serializers.ValidationError({"detail": "E-mail ou senha incorretos."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Esta conta está desativada."})

        # Define o usuário na instância para o Simple JWT gerar os tokens de acesso
        self.user = user
        
        # Gera os tokens padrão (access e refresh)
        data = {}
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        # Retorna os dados extras que seu front-end precisa
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_staff'] = self.user.is_staff
        data['full_name'] = f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username

        return data