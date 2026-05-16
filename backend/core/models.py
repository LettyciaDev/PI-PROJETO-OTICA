from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import os
from .db_storage import DatabaseStorage

db_storage = DatabaseStorage()

class ArquivoBanco(models.Model):
    nome = models.CharField(max_length=255)
    conteudo = models.BinaryField()
    content_type = models.CharField(max_length=100)
    tamanho = models.IntegerField()
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'arquivos_banco'
        verbose_name = 'Arquivo no Banco'

    def __str__(self):
        return f"{self.nome} ({self.tamanho} bytes)"

class Oculos(models.Model):
    MARCAS_CHOICES = [
        ('rayban', 'Ray-Ban'),
        ('oakley', 'Oakley'),
        ('chilli', 'Chilli Beans'),
        ('outro', 'Outro'),
    ]
    
    MATERIAL_CHOICES = [
        ('acetato', 'Acetato'),
        ('metal', 'Metal'),
        ('titanio', 'Titânio'),
        ('policarbonato', 'Policabornato'),
        ('outro', 'Outro'),
    ]

    FORMATO_CHOICES = [
        ('redondo', 'Redondo'),
        ('quadrado', 'Quadrado'),
        ('gatinho', 'Gatinho'),
        ('aviador', 'Aviador'),
        ('retangular', 'Retangular'),
        ('outro', 'Outro'),
    ]

    GENERO_CHOICES = [
        ('masculino', 'Masculino'),
        ('feminino', 'Feminino'),
        ('infantil', 'Infantil'),
        ('unissex', 'Unissex'),
    ]

    codigo_referencia = models.IntegerField(unique=True)
    nome = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    marca = models.CharField(max_length=50, choices=MARCAS_CHOICES, default='outro')
    material = models.CharField(max_length=50, choices=MATERIAL_CHOICES, default='outro')
    formato = models.CharField(max_length=50, choices=FORMATO_CHOICES, default='outro')
    genero = models.CharField(max_length=50, choices=GENERO_CHOICES)
    medida_aro = models.IntegerField()
    medida_ponte = models.IntegerField()
    medida_haste = models.IntegerField()
    preco = models.DecimalField(max_digits=8, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)

    def gerar_slug_unico(self):
        slug_base = slugify(self.nome)
        slug = slug_base
        contador = 1
        while Oculos.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{slug_base}-{contador}"
            contador += 1
        return slug

    def save(self, *args, **kwargs):
        if not self.slug or self._slug_precisa_atualizar():
            self.slug = self.gerar_slug_unico()
        super().save(*args, **kwargs)

    def _slug_precisa_atualizar(self):
        if not self.pk:
            return True
        try:
            original = Oculos.objects.get(pk=self.pk)
            return original.nome != self.nome
        except Oculos.DoesNotExist:
            return True
    
    def __str__(self):
        return f"{self.nome} - {self.get_marca_display()}"


class OculosVarianteCor(models.Model):

    oculos = models.ForeignKey(Oculos, on_delete=models.CASCADE, related_name='variantes')
    cor = models.CharField(max_length=50, verbose_name="Cor da Armação/Lente")
    quantidade_estoque = models.IntegerField(default=0, verbose_name="Estoque desta cor")

    preco_adicional = models.DecimalField(max_digits=8, decimal_places=2, default=0.00, verbose_name="Preço adicional")

    class Meta:
        unique_together = ('oculos', 'cor')
        verbose_name = "Variante de Cor"
        verbose_name_plural = "Variantes de Cores"

    def __str__(self):
        return f"{self.oculos.nome} - Cor: {self.cor}"


class OculosImagem(models.Model):

    variante = models.ForeignKey(OculosVarianteCor, on_delete=models.CASCADE, related_name='imagens')
    imagem = models.ImageField(storage=db_storage, upload_to='oculos/', verbose_name='Imagem do produto')
    
    e_principal = models.BooleanField(default=False, verbose_name="Imagem Principal da Cor")

    class Meta:
        verbose_name = "Imagem da Variante"
        verbose_name_plural = "Imagens da Variante"

    def __str__(self):
        return f"Foto ({self.variante.cor}) - {self.variante.oculos.nome}"

def receita_upload_path(instance, filename):
    """Salva em: media/receitas/usuario_<user_id>/<filename>"""
    return os.path.join('receitas', f'usuario_{instance.usuario.id}', filename)


class Reserva(models.Model):
    STATUS_CHOICES = [
        ('pendente',   'Pendente'),
        ('confirmada', 'Confirmada'),
        ('concluida',  'Concluída'),
        ('cancelada',  'Cancelada'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservas')
    oculos = models.ForeignKey('core.Oculos', on_delete=models.SET_NULL, null=True, related_name='reservas')
    oculos_snapshot = models.JSONField(verbose_name='Snapshot do óculos', help_text='Cópia de todos os dados do óculos no momento da reserva.')
    nome_cliente = models.CharField(max_length=150, verbose_name='Nome completo')
    telefone_whatsapp = models.CharField(max_length=20, verbose_name='WhatsApp')
    receita = models.FileField(storage=db_storage, upload_to=receita_upload_path, verbose_name='Receita do exame de vista', help_text='Aceita JPG, PNG, PDF ou DOCX.')
    observacoes = models.TextField(blank=True, verbose_name='Observações')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    observacoes_admin = models.TextField(blank=True, verbose_name='Observações internas (admin)')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'

    def __str__(self):
        return f"Reserva #{self.pk} — {self.nome_cliente} ({self.get_status_display()})"

class ExameAgendamento(models.Model):
    PERIODO_CHOICES = [
        ('manha', 'Manhã'),
        ('tarde', 'Tarde'),
        ('qualquer', 'Qualquer horário'),
    ]

    STATUS_CHOICES = [
        ('pendente',   'Pendente'),
        ('confirmado', 'Confirmado'),
        ('concluido',  'Concluído'),
        ('cancelado',  'Cancelado'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exames')

    # Dados do cliente
    nome_cliente = models.CharField(max_length=150, verbose_name='Nome completo')
    telefone_whatsapp = models.CharField(max_length=20, verbose_name='WhatsApp')
    convenio = models.CharField(max_length=100, blank=True, verbose_name='Convênio', help_text='Opcional')
    # Preferências de agendamento
    data_preferencia = models.DateField(verbose_name='Data de preferência')
    periodo_preferido = models.CharField(max_length=10, choices=PERIODO_CHOICES, default='qualquer', verbose_name='Período preferido')
    observacoes = models.TextField(blank=True, verbose_name='Observações / motivo do exame')
    # Controle interno da ótica
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    data_confirmada = models.DateTimeField(null=True, blank=True, verbose_name='Data e hora confirmada pela ótica')
    observacoes_admin = models.TextField(blank=True,verbose_name='Observações internas (admin)')
    retorno_cliente = models.TextField(blank=True, verbose_name='Mensagem de retorno ao cliente')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Agendamento de Exame'
        verbose_name_plural = 'Agendamentos de Exame'

    def __str__(self):
        return f"Exame #{self.pk} — {self.nome_cliente} ({self.get_status_display()})"