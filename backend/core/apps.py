from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.core'

    def ready(self):
        from apscheduler.schedulers.background import BackgroundScheduler
        from django_apscheduler.jobstores import DjangoJobStore
        from .tasks import cancelar_reservas_expiradas

        scheduler = BackgroundScheduler()
        scheduler.add_jobstore(DjangoJobStore(), 'default')

        scheduler.add_job(
            cancelar_reservas_expiradas,
            trigger='interval',
            hours=1,          # Roda a cada 1 hora
            id='cancelar_reservas',
            replace_existing=True,
        )

       
        scheduler.start()
        