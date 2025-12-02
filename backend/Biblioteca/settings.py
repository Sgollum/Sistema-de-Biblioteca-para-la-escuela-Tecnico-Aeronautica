import os
from pathlib import Path
# Se añade import para la configuración de la base de datos
from decouple import config 

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
    # CRÍTICO: Debe estar lo más arriba posible para procesar los headers CORS
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

# backend/Biblioteca/settings.py (Alrededor de la línea 100)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': 'ms_usuarios_biblioteca',
        'USER': 'ms_usuarios_dev',
        'PASSWORD': 'usuarios123',
        'HOST': '127.0.0.1', 
        'PORT': '3306', 
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    },
    
    # BASE DE DATOS PARA EL CATÁLOGO
    'catalogo_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ms_catalogo_biblioteca', 
        'USER': 'ms_usuarios_dev', 
        'PASSWORD': 'usuarios123',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    },
    
    # 🚨 NUEVA BASE DE DATOS PARA PRÉSTAMOS (¡CRÍTICO!) 
    'prestamos_db': { # <-- Nuevo nombre de conexión
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ms_prestamos_biblioteca', # Asegúrate de que esta DB exista en MySQL
        'USER': 'ms_usuarios_dev', 
        'PASSWORD': 'usuarios123',
        'HOST': '127.0.0.1',
        'PORT': '3306',
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


# --- CONFIGURACIONES DE AUTENTICACIÓN PERSONALIZADA ---

# Configuración de Usuario Personalizado
AUTH_USER_MODEL = 'MS_Usuarios.Usuario'

# 🚨 CRÍTICO: Definimos los backends para la autenticación
AUTHENTICATION_BACKENDS = [
    # 1. Nuestro backend para login con email O username
    'MS_Usuarios.backends.UsernameOrEmailBackend', 
    
    # 2. El backend por defecto de Django
    'django.contrib.auth.backends.ModelBackend',
]

# --- CONFIGURACIONES ADICIONALES (DRF y CORS) ---

# ==========================================================
# CONFIGURACIÓN CLAVE para usar TokenAuthentication (Modificado)
# ==========================================================
REST_FRAMEWORK = {
    # CRÍTICO: Usamos nuestra clase personalizada que soporta 'Bearer'.
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'MS_Usuarios.authentication.BearerTokenAuthentication', # <<-- ¡CAMBIO CLAVE!
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        # Es bueno dejar IsAuthenticated como permiso por defecto
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# ----------------------------------------------------
# CONFIGURACIÓN CORS (NECESARIO PARA ANGULAR)
# ----------------------------------------------------

# Orígenes permitidos (necesario para Angular en 4200)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

CORS_ALLOW_CREDENTIALS = True 

# CRÍTICO: Permite que el frontend envíe el Token de Autenticación en el Header.
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization', # <<-- CRÍTICO para que Django vea el token
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

DATABASE_ROUTERS = ['Biblioteca.db_routers.MicroserviceRouter']

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')