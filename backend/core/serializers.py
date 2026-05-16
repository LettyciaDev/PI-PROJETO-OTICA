from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Oculos, Reserva, ExameAgendamento
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            # Por segurança, algumas APIs preferem não informar que o email não existe,
            # mas para uso interno/admin, é comum retornar o erro.
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
            # Decodifica o ID do usuário vindo da URL (base64)
            uid = urlsafe_base64_decode(data['uid']).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "ID de usuário inválido."})

        # Validação crucial: o token é válido para este usuário específico?
        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError({"token": "Token inválido ou expirado."})

        # Guardamos o usuário no contexto para usar no método save()
        self.user = user
        return data

    def save(self):
        # Atualiza a senha e limpa tokens antigos
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()
        return self.user 
    

# oculos/serializers.py
class OculosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oculos
        fields = '__all__'
        read_only_fields = ['criado_em']

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
            'cor': oculos.cor,
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

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Adiciona dados customizados do utilizador
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_staff'] = self.user.is_staff  
        
        return data

class StaffRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        # Criamos o usuário e já atribuímos o status de equipe (staff)
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
        # Aceita formatos: (81) 99999-9999 ou 81999999999
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