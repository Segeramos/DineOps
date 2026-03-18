# backend/utils/firebase_auth.py
import firebase_admin.auth as fb_auth
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from apps.accounts.models import User


class FirebaseAuthentication(BaseAuthentication):
    """
    Verifies Firebase ID token from Authorization header.
    Attaches the Django User to request.user.
    Creates user in DB on first login.
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split('Bearer ')[1]

        try:
            decoded = fb_auth.verify_id_token(token)
        except fb_auth.ExpiredIdTokenError:
            raise AuthenticationFailed('Firebase token has expired.')
        except fb_auth.InvalidIdTokenError:
            raise AuthenticationFailed('Invalid Firebase token.')
        except Exception as e:
            raise AuthenticationFailed(f'Firebase auth error: {str(e)}')

        uid   = decoded.get('uid')
        email = decoded.get('email', '')
        name  = decoded.get('name', '')

        # Get or create user in Django DB
        user, created = User.objects.get_or_create(
            firebase_uid=uid,
            defaults={
                'email':    email,
                'username': email,
                'name':     name,
            }
        )

        # Update name/email if changed in Firebase
        if not created:
            updated = False
            if user.email != email:
                user.email = email
                updated = True
            if user.name != name and name:
                user.name = name
                updated = True
            if updated:
                user.save()

        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer'
