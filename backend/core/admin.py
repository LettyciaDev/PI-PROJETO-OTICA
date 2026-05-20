from django.contrib import admin
from .models import Oculos, OculosVarianteCor, OculosImagem, Reserva, ExameAgendamento, ItemCarrinho


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
    list_display = ['id', 'nome_cliente', 'telefone_whatsapp', 'total_itens', 'status', 'criado_em']
    list_filter = ['status']
    search_fields = ['nome_cliente', 'telefone_whatsapp', 'usuario__username']
    readonly_fields = ['oculos_snapshot', 'criado_em', 'atualizado_em']
    list_editable = ['status']

    def total_itens(self, obj):
        total = obj.itens.count()
        return f"{total} óculos"
    total_itens.short_description = 'Itens'

    fieldsets = (
        ('Cliente', {
            'fields': ('usuario', 'nome_cliente', 'telefone_whatsapp')
        }),
        ('Visita', {
            'fields': ('data_visita', 'horario_visita')
        }),
        ('Óculos', {
            'fields': ('oculos_snapshot',)
        }),
        ('Observações', {
            'fields': ('observacoes',)
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
    readonly_fields = ['criado_em', 'atualizado_em']
    list_editable = ['status']

    def save_model(self, request, obj, form, change):
        if not obj.usuario_id:
            obj.usuario = request.user
        super().save_model(request, obj, form, change)

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
    
admin.site.register(ItemCarrinho)