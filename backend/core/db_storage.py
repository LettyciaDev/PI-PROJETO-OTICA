from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.urls import reverse
import mimetypes


class DatabaseStorage(Storage):

    def deconstruct(self):
        """Permite que o Django serialize esta classe nas migrations."""
        return ('backend.core.db_storage.DatabaseStorage', [], {})

    def _save(self, name, content):
        from .models import ArquivoBanco

        conteudo = content.read()
        content_type, _ = mimetypes.guess_type(name)
        content_type = content_type or 'application/octet-stream'

        arquivo = ArquivoBanco.objects.create(
            nome=name,
            conteudo=conteudo,
            content_type=content_type,
            tamanho=len(conteudo),
        )

        return f"db://{arquivo.pk}/{name}"

    def _open(self, name, mode='rb'):
        from .models import ArquivoBanco

        pk = self._extrair_pk(name)
        arquivo = ArquivoBanco.objects.get(pk=pk)
        return ContentFile(bytes(arquivo.conteudo), name=arquivo.nome)

    def exists(self, name):
        from .models import ArquivoBanco

        try:
            pk = self._extrair_pk(name)
            return ArquivoBanco.objects.filter(pk=pk).exists()
        except (ValueError, IndexError):
            return False

    def delete(self, name):
        from .models import ArquivoBanco

        try:
            pk = self._extrair_pk(name)
            ArquivoBanco.objects.filter(pk=pk).delete()
        except (ValueError, IndexError):
            pass

    def url(self, name):
        try:
            pk = self._extrair_pk(name)
            return reverse('arquivo-banco', kwargs={'pk': pk})
        except (ValueError, IndexError):
            return ''

    def size(self, name):
        from .models import ArquivoBanco

        pk = self._extrair_pk(name)
        arquivo = ArquivoBanco.objects.get(pk=pk)
        return arquivo.tamanho

    def _extrair_pk(self, name):
        partes = name.replace('db://', '').split('/', 1)
        return int(partes[0])