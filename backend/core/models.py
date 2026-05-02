from django.db import models

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
    marca = models.CharField(max_length=50, choices=MARCAS_CHOICES, default='outro')
    material = models.CharField(max_length=50, choices=MATERIAL_CHOICES, default='outro')
    cor = models.CharField(max_length=50)
    formato = models.CharField(max_length=50, choices=FORMATO_CHOICES, default='outro')
    genero = models.CharField(max_length=50, choices=GENERO_CHOICES)
    medida_aro = models.IntegerField()
    medida_ponte = models.IntegerField()
    medida_haste = models.IntegerField()
    preco = models.DecimalField(max_digits=8, decimal_places=2) # Até 999.999,99
    quantidade_estoque = models.IntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True) # Data automática de quando foi salvo

    def __str__(self):
        return f"{self.nome} - {self.marca}"