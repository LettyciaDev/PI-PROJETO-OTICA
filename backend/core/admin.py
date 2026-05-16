from django.contrib import admin
from .models import Oculos, Reserva, ExameAgendamento

admin.site.register(Oculos)

# reservas/admin.py
@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome_cliente', 'telefone_whatsapp', 'oculos', 'status', 'criado_em']
    list_filter = ['status']
    search_fields = ['nome_cliente', 'telefone_whatsapp', 'usuario__username']
    readonly_fields = ['oculos_snapshot', 'criado_em', 'atualizado_em']
    list_editable = ['status']

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
    readonly_fields = ['criado_em', 'atualizado_em']
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