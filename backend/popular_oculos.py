"""
Script para popular o banco com óculos de exemplo.
Coloque este arquivo na raiz do backend e rode:
    python popular_oculos.py
ou dentro do Django shell:
    python manage.py shell < popular_oculos.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.core.models import Oculos, OculosVarianteCor

oculos_data = [
    {
        "codigo_referencia": 101,
        "nome": "Ray-Ban Aviador Clássico",
        "marca": "rayban",
        "material": "metal",
        "formato": "aviador",
        "genero": "unissex",
        "medida_aro": 58,
        "medida_ponte": 14,
        "medida_haste": 135,
        "preco": "499.90",
        "variantes": [
            {"cor": "Dourado", "quantidade_estoque": 10, "preco_adicional": "0.00"},
            {"cor": "Prateado", "quantidade_estoque": 8, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 102,
        "nome": "Ray-Ban Wayfarer Original",
        "marca": "rayban",
        "material": "acetato",
        "formato": "quadrado",
        "genero": "unissex",
        "medida_aro": 54,
        "medida_ponte": 18,
        "medida_haste": 145,
        "preco": "549.90",
        "variantes": [
            {"cor": "Preto", "quantidade_estoque": 15, "preco_adicional": "0.00"},
            {"cor": "Tartaruga", "quantidade_estoque": 10, "preco_adicional": "30.00"},
        ],
    },
    {
        "codigo_referencia": 103,
        "nome": "Ray-Ban Round Metal",
        "marca": "rayban",
        "material": "metal",
        "formato": "redondo",
        "genero": "unissex",
        "medida_aro": 50,
        "medida_ponte": 21,
        "medida_haste": 145,
        "preco": "479.90",
        "variantes": [
            {"cor": "Ouro Antigo", "quantidade_estoque": 7, "preco_adicional": "0.00"},
            {"cor": "Preto", "quantidade_estoque": 5, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 201,
        "nome": "Oakley Holbrook",
        "marca": "oakley",
        "material": "acetato",
        "formato": "quadrado",
        "genero": "masculino",
        "medida_aro": 55,
        "medida_ponte": 18,
        "medida_haste": 137,
        "preco": "699.90",
        "variantes": [
            {"cor": "Preto Fosco", "quantidade_estoque": 12, "preco_adicional": "0.00"},
            {"cor": "Marrom", "quantidade_estoque": 6, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 202,
        "nome": "Oakley Frogskins",
        "marca": "oakley",
        "material": "acetato",
        "formato": "redondo",
        "genero": "unissex",
        "medida_aro": 55,
        "medida_ponte": 17,
        "medida_haste": 133,
        "preco": "649.90",
        "variantes": [
            {"cor": "Azul", "quantidade_estoque": 9, "preco_adicional": "0.00"},
            {"cor": "Vermelho", "quantidade_estoque": 7, "preco_adicional": "0.00"},
            {"cor": "Preto", "quantidade_estoque": 14, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 203,
        "nome": "Oakley Turbine",
        "marca": "oakley",
        "material": "acetato",
        "formato": "quadrado",
        "genero": "masculino",
        "medida_aro": 65,
        "medida_ponte": 17,
        "medida_haste": 135,
        "preco": "729.90",
        "variantes": [
            {"cor": "Preto Polido", "quantidade_estoque": 8, "preco_adicional": "0.00"},
            {"cor": "Cinza", "quantidade_estoque": 5, "preco_adicional": "20.00"},
        ],
    },
    {
        "codigo_referencia": 301,
        "nome": "Chilli Beans Gatinho Vintage",
        "marca": "chilli",
        "material": "acetato",
        "formato": "gatinho",
        "genero": "feminino",
        "medida_aro": 52,
        "medida_ponte": 16,
        "medida_haste": 140,
        "preco": "299.90",
        "variantes": [
            {"cor": "Rosa", "quantidade_estoque": 11, "preco_adicional": "0.00"},
            {"cor": "Nude", "quantidade_estoque": 9, "preco_adicional": "0.00"},
            {"cor": "Preto", "quantidade_estoque": 13, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 302,
        "nome": "Chilli Beans Redondo Colorido",
        "marca": "chilli",
        "material": "acetato",
        "formato": "redondo",
        "genero": "unissex",
        "medida_aro": 48,
        "medida_ponte": 20,
        "medida_haste": 140,
        "preco": "259.90",
        "variantes": [
            {"cor": "Amarelo", "quantidade_estoque": 8, "preco_adicional": "0.00"},
            {"cor": "Verde", "quantidade_estoque": 6, "preco_adicional": "0.00"},
            {"cor": "Azul", "quantidade_estoque": 7, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 303,
        "nome": "Chilli Beans Quadrado Street",
        "marca": "chilli",
        "material": "acetato",
        "formato": "quadrado",
        "genero": "masculino",
        "medida_aro": 56,
        "medida_ponte": 17,
        "medida_haste": 145,
        "preco": "279.90",
        "variantes": [
            {"cor": "Preto", "quantidade_estoque": 15, "preco_adicional": "0.00"},
            {"cor": "Tartaruga", "quantidade_estoque": 10, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 401,
        "nome": "Armação Titânio Slim",
        "marca": "outro",
        "material": "titanio",
        "formato": "retangular",
        "genero": "unissex",
        "medida_aro": 53,
        "medida_ponte": 17,
        "medida_haste": 140,
        "preco": "389.90",
        "variantes": [
            {"cor": "Prata", "quantidade_estoque": 6, "preco_adicional": "0.00"},
            {"cor": "Dourado", "quantidade_estoque": 4, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 402,
        "nome": "Infantil Flex Colorido",
        "marca": "outro",
        "material": "policarbonato",
        "formato": "redondo",
        "genero": "infantil",
        "medida_aro": 44,
        "medida_ponte": 14,
        "medida_haste": 120,
        "preco": "189.90",
        "variantes": [
            {"cor": "Azul", "quantidade_estoque": 10, "preco_adicional": "0.00"},
            {"cor": "Rosa", "quantidade_estoque": 10, "preco_adicional": "0.00"},
            {"cor": "Verde", "quantidade_estoque": 8, "preco_adicional": "0.00"},
        ],
    },
    {
        "codigo_referencia": 403,
        "nome": "Gatinho Metal Delicado",
        "marca": "outro",
        "material": "metal",
        "formato": "gatinho",
        "genero": "feminino",
        "medida_aro": 50,
        "medida_ponte": 18,
        "medida_haste": 138,
        "preco": "319.90",
        "variantes": [
            {"cor": "Rosê", "quantidade_estoque": 8, "preco_adicional": "0.00"},
            {"cor": "Dourado", "quantidade_estoque": 6, "preco_adicional": "0.00"},
        ],
    },
]

criados = 0
pulados = 0

for dados in oculos_data:
    variantes = dados.pop("variantes")

    oculos, criado = Oculos.objects.get_or_create(
        codigo_referencia=dados["codigo_referencia"],
        defaults=dados,
    )

    if criado:
        for v in variantes:
            OculosVarianteCor.objects.get_or_create(
                oculos=oculos,
                cor=v["cor"],
                defaults={
                    "quantidade_estoque": v["quantidade_estoque"],
                    "preco_adicional": v["preco_adicional"],
                },
            )
        criados += 1
        print(f"✔ Criado: {oculos.nome}")
    else:
        pulados += 1
        print(f"— Já existe: {oculos.nome}")

print(f"\nConcluído! {criados} criados, {pulados} já existiam.")