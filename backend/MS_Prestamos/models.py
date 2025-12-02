from django.db import models

class Prestamo(models.Model):
    ESTADOS = [
        ("pendiente", "Pendiente"),
        ("listo", "Listo para retirar"),
        ("rechazado", "Rechazado"),
        ("prestado", "Prestado"),
        ("devuelto", "Devuelto"),
    ]

    # Dejamos de depender del microservicio de usuarios
    lector_id = models.IntegerField()  # solo el ID del usuario

    # Dejamos de depender del microservicio catálogo
    libro_id = models.IntegerField()  # solo el ID del libro

    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion_esperada = models.DateTimeField(null=True, blank=True)

    estado = models.CharField(max_length=20, choices=ESTADOS, default="pendiente")
    esta_activo = models.BooleanField(default=True)

    def __str__(self):
        return f"Lector {self.lector_id} → Libro {self.libro_id} ({self.estado})"
