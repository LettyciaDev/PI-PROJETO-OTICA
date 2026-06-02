from django.apps import AppConfig
import os

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.core'

    def ready(self):
        import backend.core.signals

        if os.environ.get('RUN_MAIN') or os.environ.get('DJANGO_MANAGE_COMMAND') is None:
            try:
                from apscheduler.schedulers.background import BackgroundScheduler
                from django_apscheduler.jobstores import DjangoJobStore
                from .tasks import cancelar_reservas_expiradas

                scheduler = BackgroundScheduler()
                scheduler.add_jobstore(DjangoJobStore(), 'default')

                scheduler.add_job(
                    cancelar_reservas_expiradas,
                    trigger='interval',
                    hours=1,
                    id='cancelar_reservas',
                    replace_existing=True,
                )

                scheduler.start()
            except Exception:
                pass