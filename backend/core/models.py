from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import os

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
    cor = models.CharField(max_length=50)
    formato = models.CharField(max_length=50, choices=FORMATO_CHOICES, default='outro')
    genero = models.CharField(max_length=50, choices=GENERO_CHOICES)
    medida_aro = models.IntegerField()
    medida_ponte = models.IntegerField()
    medida_haste = models.IntegerField()
    preco = models.DecimalField(max_digits=8, decimal_places=2)
    quantidade_estoque = models.IntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.nome} - {self.marca}"

# reservas/models.py
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

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reservas'
    )

    oculos = models.ForeignKey('core.Oculos', on_delete=models.SET_NULL, null=True, related_name='reservas')
    
    oculos_snapshot = models.JSONField(
        verbose_name='Snapshot do óculos',
        help_text='Cópia de todos os dados do óculos no momento da reserva.'
    )

    nome_cliente = models.CharField(max_length=150, verbose_name='Nome completo')
    telefone_whatsapp = models.CharField(max_length=20, verbose_name='WhatsApp')
    receita = models.FileField(
        upload_to=receita_upload_path,
        verbose_name='Receita do exame de vista',
        help_text='Aceita JPG, PNG, PDF ou DOCX.'
    )
    observacoes = models.TextField(blank=True, verbose_name='Observações')

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente'
    )
    observacoes_admin = models.TextField(
        blank=True,
        verbose_name='Observações internas (admin)'
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'

    def __str__(self):
        return f"Reserva #{self.pk} — {self.nome_cliente} ({self.get_status_display()})"