from rest_framework import permissions

class IsAdminUserOnly(permissions.BasePermission):
    """
    Permite acesso apenas a usuários que possuem is_staff=True,
    mas bloqueia usuários comuns.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)