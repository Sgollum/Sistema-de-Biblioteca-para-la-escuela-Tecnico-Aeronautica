from django.db import models
from MS_Usuarios.models import Usuario
from MS_Catalogo.models import Libro

class Prestamo(models.Model):
    ESTADOS = [
        ("pendiente", "Pendiente"),
        ("listo", "Listo para retirar"),
        ("rechazado", "Rechazado"),
        ("prestado", "Prestado"),
        ("devuelto", "Devuelto"),
    ]

    lector = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)

    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion_esperada = models.DateTimeField(null=True, blank=True)

    estado = models.CharField(max_length=20, choices=ESTADOS, default="pendiente")
    esta_activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.lector.username} → {self.libro.titulo} ({self.estado})"
