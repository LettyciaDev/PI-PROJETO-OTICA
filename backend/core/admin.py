from django.contrib import admin
from .models import Oculos, OculosVarianteCor, OculosImagem, Reserva, ExameAgendamento


class OculosImagemInline(admin.TabularInline):
    model = OculosImagem
    extra = 1


class OculosVarianteInline(admin.TabularInline):
    model = OculosVarianteCor
    extra = 1
    show_change_link = True


@admin.register(Oculos)
class OculosAdmin(admin.ModelAdmin):
    readonly_fields = ['slug', 'criado_em']
    inlines = [OculosVarianteInline]


@admin.register(OculosVarianteCor)
class OculosVarianteCorAdmin(admin.ModelAdmin):
    inlines = [OculosImagemInline]
    list_display = ['oculos', 'cor', 'quantidade_estoque', 'preco_adicional']


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome_cliente', 'telefone_whatsapp', 'oculos', 'status', 'criado_em']
    list_filter = ['status']
    search_fields = ['nome_cliente', 'telefone_whatsapp', 'usuario__username']
    readonly_fields = ['oculos_snapshot', 'criado_em', 'atualizado_em']
    list_editable = ['status']

    def save_model(self, request, obj, form, change):
        if not obj.usuario_id:
            obj.usuario = request.user
        if not obj.oculos_snapshot and obj.oculos:
            oculos = obj.oculos
            obj.oculos_snapshot = {
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
        super().save_model(request, obj, form, change)

    fieldsets = (
        ('Cliente', {
            'fields': ('usuario', 'nome_cliente', 'telefone_whatsapp')
        }),
        ('Óculos', {
            'fields': ('oculos', 'oculos_snapshot')
        }),
        ('Receita e Observações', {
            'fields': ('receita', 'observacoes')
        }),
        ('Controle interno', {
            'fields': ('status', 'observacoes_admin', 'criado_em', 'atualizado_em')
        }),
    )


@admin.register(ExameAgendamento)
class ExameAgendamentoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome_cliente', 'telefone_whatsapp', 'data_preferencia',
                    'periodo_preferido', 'status', 'criado_em']
    list_filter = ['status', 'periodo_preferido']
    search_fields = ['nome_cliente', 'telefone_whatsapp', 'usuario__username']
    readonly_fields = ['criado_em', 'atualizado_em', 'usuario']
    list_editable = ['status']

    fieldsets = (
        ('Cliente', {
            'fields': ('usuario', 'nome_cliente', 'telefone_whatsapp', 'convenio')
        }),
        ('Preferências', {
            'fields': ('data_preferencia', 'periodo_preferido', 'observacoes')
        }),
        ('Controle interno', {
            'fields': ('status', 'data_confirmada', 'observacoes_admin',
                       'retorno_cliente', 'criado_em', 'atualizado_em')
        }),
    )