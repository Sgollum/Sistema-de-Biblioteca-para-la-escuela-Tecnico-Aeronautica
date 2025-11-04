# backend/MS_Catalogo/admin.py
from django.contrib import admin
from .models import Autor, Categoria, Libro

# Registrar los modelos
admin.site.register(Autor)
admin.site.register(Categoria)
admin.site.register(Libro)