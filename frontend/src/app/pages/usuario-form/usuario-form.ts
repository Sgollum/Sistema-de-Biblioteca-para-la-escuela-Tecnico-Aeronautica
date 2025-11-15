import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

// Interface para el modelo de Usuario (simplificado)
interface UsuarioFormModel {
  nombre: string;
  apellido: string;
  email: string;
  rol: 'Administrador' | 'Bibliotecario' | 'Lector';
  contrasena?: string; // Solo necesario en la creación
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.html',
  styleUrls: ['./usuario-form.css']
})
export class UsuarioFormComponent implements OnInit {
  
  // Estado para saber si estamos editando o creando
  isEditMode: boolean = false;
  usuarioId: string | null = null;
  
  // Modelo de datos para el formulario
  usuario: UsuarioFormModel = {
    nombre: '',
    apellido: '',
    email: '',
    rol: 'Lector', // Rol por defecto
    contrasena: '',
  };
  
  // Opciones de rol disponibles
  roles: ('Administrador' | 'Bibliotecario' | 'Lector')[] = ['Lector', 'Bibliotecario', 'Administrador'];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Verificar si estamos en modo edición
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.usuarioId;

    if (this.isEditMode) {
      this.loadUsuarioData(this.usuarioId!);
    }
  }

  // Simulación de carga de datos de usuario para edición
  loadUsuarioData(id: string): void {
    console.log(`Fetching user data for ID: ${id}...`);
    // MOCK: En una app real, aquí se llama al servicio para obtener los datos
    const mockData = {
      nombre: 'Javier',
      apellido: 'López',
      email: 'javier.lopez@biblioteca.cl',
      rol: 'Bibliotecario' as 'Bibliotecario',
    };
    
    // Rellenar el formulario con los datos simulados
    this.usuario.nombre = mockData.nombre;
    this.usuario.apellido = mockData.apellido;
    this.usuario.email = mockData.email;
    this.usuario.rol = mockData.rol;
    
    // En modo edición, no es necesario cargar la contraseña
    this.usuario.contrasena = ''; 
  }

  // Manejador del submit del formulario
  onSubmit(): void {
    if (this.isEditMode) {
      // Lógica para actualizar (UPDATE) el usuario
      console.log(`Updating user ${this.usuarioId}:`, this.usuario);
      alert(`User ${this.usuarioId} updated successfully.`);
    } else {
      // Lógica para crear (CREATE) el nuevo usuario
      console.log('Creating new user:', this.usuario);
      alert('New user created successfully.');
    }
    
    // Redirigir de vuelta a la lista de usuarios
    this.router.navigate(['/gestion-usuarios']);
  }

  // Redirigir a la lista al cancelar
  onCancel(): void {
    this.router.navigate(['/gestion-usuarios']);
  }
}