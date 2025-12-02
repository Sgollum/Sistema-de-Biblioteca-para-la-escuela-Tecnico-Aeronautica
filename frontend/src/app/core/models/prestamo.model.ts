// src/app/core/models/prestamo.model.ts

// Interfaz para representar un Préstamo en el frontend.
// Esta estructura coincide con el PrestamoSerializer que definimos en Django.
export interface Prestamo {
  id: number;
  
  // ID del Libro (FK en Django, pero aquí lo tratamos como ID)
  libro: number; 
  
  // Título del libro (campo de solo lectura de la API de Django para mostrar)
  titulo_libro: string; 
  
  // ID del lector que tomó el libro (coincide con el lector_id de Django)
  lector_id: number; 
  
  fecha_prestamo: string; // Formato YYYY-MM-DD
  fecha_devolucion_esperada: string; // Formato YYYY-MM-DD
  
  // True si está activo (no devuelto), False si fue devuelto
  esta_activo: boolean; 
}

// Interfaz para registrar un NUEVO préstamo (payload de envío POST)
// Esto coincide con el RegistroPrestamoSerializer de Django.
export interface NuevoPrestamo {
  libro: number;
  lector_id: number;
  dias_prestamo: number; // Campo que calcula la fecha_devolucion en Django
}