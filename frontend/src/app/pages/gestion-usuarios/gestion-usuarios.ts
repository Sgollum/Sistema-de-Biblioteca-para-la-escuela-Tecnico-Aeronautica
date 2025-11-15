import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Interfaz para el modelo de Usuario
interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'Administrador' | 'Bibliotecario' | 'Lector';
  activo: boolean; // Estado de la cuenta
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuariosComponent implements OnInit {

  // Lista de usuarios (simulada)
  usuarios: Usuario[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicializar con datos simulados
    this.loadUsuarios();
  }

  // Simulación de carga de usuarios
  loadUsuarios(): void {
    // MOCK DATA: En la aplicación real, esto vendría de un servicio HTTP
    this.usuarios = [
      { id: '1', nombre: 'Carlos', apellido: 'García', email: 'carlos.g@dgac.cl', rol: 'Administrador', activo: true },
      { id: '2', nombre: 'Ana', apellido: 'Pérez', email: 'ana.p@dgac.cl', rol: 'Bibliotecario', activo: true },
      { id: '3', nombre: 'José', apellido: 'Mora', email: 'jose.m@dgac.cl', rol: 'Lector', activo: true },
      { id: '4', nombre: 'María', apellido: 'Soto', email: 'maria.s@dgac.cl', rol: 'Lector', activo: false },
      { id: '5', nombre: 'Felipe', apellido: 'Rojas', email: 'felipe.r@dgac.cl', rol: 'Bibliotecario', activo: true },
    ];
  }

  // Navegar a la página de creación de usuario
  crearUsuario(): void {
    this.router.navigate(['/crear-usuario']);
  }

  // Navegar a la página de edición de usuario
  editarUsuario(id: string): void {
    this.router.navigate(['/editar-usuario', id]);
  }

  // Simulación de acción de habilitar/deshabilitar cuenta
  toggleActive(usuario: Usuario): void {
    usuario.activo = !usuario.activo;
    const action = usuario.activo ? 'habilitada' : 'deshabilitada';
    console.log(`Cuenta del usuario ${usuario.nombre} ${usuario.apellido} ha sido ${action}.`);
    alert(`Cuenta de ${usuario.nombre} ${usuario.apellido} ha sido ${action}.`);
    // En una app real: llamar a un servicio para guardar el cambio
  }

  // Simulación de acción de eliminación (usualmente se evita la eliminación física)
  eliminarUsuario(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar a este usuario?')) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      console.log(`Usuario ID: ${id} eliminado.`);
      alert(`Usuario ID: ${id} eliminado.`);
      // En una app real: llamar a un servicio para eliminar o desactivar permanentemente
    }
  }
}