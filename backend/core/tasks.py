from django.utils import timezone
from datetime import timedelta


def cancelar_reservas_expiradas():
    """Cancela reservas pendentes com mais de 48 horas automaticamente."""
    from .models import Reserva

    limite = timezone.now() - timedelta(hours=48)

    reservas_expiradas = Reserva.objects.filter(
        status='pendente',
        criado_em__lte=limite
    )

    total = reservas_expiradas.count()

    reservas_expiradas.update(
        status='cancelada',
        observacoes_admin='Cancelada automaticamente por falta de confirmação em 48 horas.'
    )

    print(f"[Scheduler] {total} reserva(s) cancelada(s) automaticamente.")