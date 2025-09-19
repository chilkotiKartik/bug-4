from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import exceptions
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication class with enhanced error handling
    """
    
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        user = self.get_user(validated_token)
        
        # Check if user is active
        if not user.is_active:
            raise exceptions.AuthenticationFailed(_('User account is disabled.'))
            
        return user, validated_token

    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token['user_id']
        except KeyError:
            raise InvalidToken(_('Token contained no recognizable user identification'))

        try:
            user = User.objects.get(**{'id': user_id})
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('User not found'), code='user_not_found')

        return user


class APIKeyAuthentication:
    """
    Simple API Key authentication for external integrations
    """
    
    def authenticate(self, request):
        api_key = request.META.get('HTTP_X_API_KEY')
        if not api_key:
            return None
            
        # In a real implementation, you would validate the API key against a database
        # For now, this is a placeholder
        if api_key == 'demo-api-key':
            try:
                # Return a system user for API access
                user = User.objects.get(username='system')
                return (user, None)
            except User.DoesNotExist:
                pass
                
        return None

    def authenticate_header(self, request):
        return 'X-API-Key'
