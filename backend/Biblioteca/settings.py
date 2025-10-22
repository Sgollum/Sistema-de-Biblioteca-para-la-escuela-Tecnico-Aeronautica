"""
Django settings for Biblioteca project.
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production

SECRET_KEY = 'django-insecure-u%$xr^pgt-gli*1qepkbfj3&^+4m&t9oxj=m(+-55qu&u5438x'

DEBUG = True

ALLOWED_HOSTS = []


# biblioteca/settings.py (cerca de la línea 40)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # TERCEROS
    'corsheaders',  
    'rest_framework',
    'rest_framework.authtoken',
    
    # MICROSERVICIOS
    'MS_Usuarios',
    'MS_Catalogo',
    'MS_Prestamos',
    'MS_Reportes',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Biblioteca.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'Templates')],
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

WSGI_APPLICATION = 'Biblioteca.wsgi.application'


# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Motor de MySQL
        'NAME': 'ms_usuarios_biblioteca',     # Nombre de la DB
        'USER': 'ms_usuarios_dev',            # Tu usuario dedicado
        'PASSWORD': 'usuarios123',            # Contraseña de ese usuario
        'HOST': '127.0.0.1',                  # Conexión local
        'PORT': '3306',                       # Puerto de MySQL
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'es'

TIME_ZONE = 'America/Santiago'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)

STATIC_URL = 'static/'

# Default primary key field type

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# --- CONFIGURACIONES ADICIONALES (DRF y CORS) ---

# Configuración de Usuario Personalizado
AUTH_USER_MODEL = 'MS_Usuarios.Usuario'

# 💡 CONFIGURACIÓN CLAVE para resolver el error 500 del Token
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# Configuración CORS (NECESARIO PARA ANGULAR)
# 💡 Usamos la lista de orígenes permitidos (más seguro)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # Origen por defecto de Angular
    "http://127.0.0.1:4200",
]
CORS_ALLOW_CREDENTIALS = True 
# La opción CORS_ALLOW_ALL_ORIGINS = True fue eliminada para mayor seguridad.