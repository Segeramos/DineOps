<<<<<<< HEAD
=======
# backend/config/settings.py
>>>>>>> backend/setup
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

<<<<<<< HEAD
=======
# ── Applications ───────────────────────────────────────────────────
>>>>>>> backend/setup
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.menu',
    'apps.orders',
    'apps.reservations',
    'apps.payments',
    'apps.accounting',
    'apps.receipts',
    'apps.hr',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

<<<<<<< HEAD
=======
# ── Middleware ─────────────────────────────────────────────────────
>>>>>>> backend/setup
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

<<<<<<< HEAD
=======
# ── Database ───────────────────────────────────────────────────────
>>>>>>> backend/setup
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

<<<<<<< HEAD
=======
# ── Auth ───────────────────────────────────────────────────────────
>>>>>>> backend/setup
AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

<<<<<<< HEAD
=======
# ── REST Framework ─────────────────────────────────────────────────
>>>>>>> backend/setup
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'utils.firebase_auth.FirebaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

<<<<<<< HEAD
=======
# ── CORS ───────────────────────────────────────────────────────────
>>>>>>> backend/setup
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173'
).split(',')
CORS_ALLOW_CREDENTIALS = True

<<<<<<< HEAD
=======
# ── Firebase ───────────────────────────────────────────────────────
>>>>>>> backend/setup
import firebase_admin
from firebase_admin import credentials

FIREBASE_CREDENTIALS_PATH = config('FIREBASE_CREDENTIALS_PATH')

<<<<<<< HEAD
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase init warning: {e}")

MPESA_CONSUMER_KEY    = config('MPESA_CONSUMER_KEY', default='')
MPESA_CONSUMER_SECRET = config('MPESA_CONSUMER_SECRET', default='')
MPESA_SHORTCODE       = config('MPESA_SHORTCODE', default='')
MPESA_PASSKEY         = config('MPESA_PASSKEY', default='')
MPESA_CALLBACK_URL    = config('MPESA_CALLBACK_URL', default='')
MPESA_ENV             = config('MPESA_ENV', default='sandbox')

STRIPE_SECRET_KEY     = config('STRIPE_SECRET_KEY', default='')
STRIPE_WEBHOOK_SECRET = config('STRIPE_WEBHOOK_SECRET', default='')

PAYPAL_CLIENT_ID      = config('PAYPAL_CLIENT_ID', default='')
PAYPAL_CLIENT_SECRET  = config('PAYPAL_CLIENT_SECRET', default='')
PAYPAL_MODE           = config('PAYPAL_MODE', default='sandbox')

=======
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)

# ── Mpesa ──────────────────────────────────────────────────────────
MPESA_CONSUMER_KEY      = config('MPESA_CONSUMER_KEY')
MPESA_CONSUMER_SECRET   = config('MPESA_CONSUMER_SECRET')
MPESA_SHORTCODE         = config('MPESA_SHORTCODE')
MPESA_PASSKEY           = config('MPESA_PASSKEY')
MPESA_CALLBACK_URL      = config('MPESA_CALLBACK_URL')
MPESA_ENV               = config('MPESA_ENV', default='sandbox')

# ── Stripe ─────────────────────────────────────────────────────────
STRIPE_SECRET_KEY       = config('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET   = config('STRIPE_WEBHOOK_SECRET')

# ── PayPal ─────────────────────────────────────────────────────────
PAYPAL_CLIENT_ID        = config('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET    = config('PAYPAL_CLIENT_SECRET')
PAYPAL_MODE             = config('PAYPAL_MODE', default='sandbox')

# ── Internationalization ───────────────────────────────────────────
>>>>>>> backend/setup
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True

<<<<<<< HEAD
=======
# ── Static & Media ─────────────────────────────────────────────────
>>>>>>> backend/setup
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

<<<<<<< HEAD
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5173')
=======
# ── Frontend URL ───────────────────────────────────────────────────
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5173')
>>>>>>> backend/setup
