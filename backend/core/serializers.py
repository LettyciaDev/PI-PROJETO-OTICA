from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Oculos, Reserva


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