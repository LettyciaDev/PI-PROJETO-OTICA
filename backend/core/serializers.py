from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Oculos, OculosVarianteCor, OculosImagem, Reserva, ExameAgendamento
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    # Adicionamos o campo full_name (apenas para receber do front)
    full_name = serializers.CharField(write_only=True, required=True, max_length=150)

    class Meta:
        model = User
        # Adicione 'full_name' aos campos aceitos
        fields = ('username', 'password', 'email', 'full_name')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def create(self, validated_data):
            # Remove o full_name dos dados validados com segurança
            full_name = validated_data.pop('full_name', '').strip()
            
            # Inicializa as variáveis vazias
            first_name = ""
            last_name = ""

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

EXTENSOES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.pdf', '.docx']


class UsuarioResumoSerializer(serializers.ModelSerializer):
    nome_completo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nome_completo']

    def get_nome_completo(self, obj):
        return obj.get_full_name() or obj.username


class ReservaSerializer(serializers.ModelSerializer):
    usuario_detalhe = UsuarioResumoSerializer(source='usuario', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'
        read_only_fields = ['criado_em', 'atualizado_em', 'oculos_snapshot', 'usuario']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def validate_oculos(self, value):
        if value is None:
            raise serializers.ValidationError("Selecione um óculos válido.")
        return value

    def validate_receita(self, value):
        import os
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in EXTENSOES_PERMITIDAS:
            raise serializers.ValidationError(
                f"Formato não permitido. Use: {', '.join(EXTENSOES_PERMITIDAS)}"
            )
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("O arquivo deve ter no máximo 10 MB.")
        return value

    def create(self, validated_data):
        oculos = validated_data['oculos']

        validated_data['oculos_snapshot'] = {
            'id': oculos.id,
            'codigo_referencia': oculos.codigo_referencia,
            'nome': oculos.nome,
            'marca': oculos.get_marca_display(),
            'material': oculos.get_material_display(),
            'formato': oculos.get_formato_display(),
            'genero': oculos.get_genero_display(),
            'medida_aro': oculos.medida_aro,
            'medida_ponte': oculos.medida_ponte,
            'medida_haste': oculos.medida_haste,
            'preco': str(oculos.preco),
        }

        return super().create(validated_data)


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
        data['full_name'] = f"{self.user.first_name} {self.user.last_name}".strip()

        return data