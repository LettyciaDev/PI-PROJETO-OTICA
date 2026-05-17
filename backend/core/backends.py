from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User

class EmailBackend(BaseBackend):
    # ATENÇÃO: Verifique a grafia exata de "authenticate" (com 'h' e dois 't's)
    def authenticate(self, request, username=None, password=None, **kwargs):
        # O Django Admin envia o e-mail no campo 'username'
        # Seu login personalizado pode enviar no campo 'email'
        email = username or kwargs.get('email')
        
        if not email:
            return None
            
        try:
            # Busca o usuário pelo e-mail
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        # Verifica a senha usando o método nativo do Django
        if user.check_password(password) and user.is_active:
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None