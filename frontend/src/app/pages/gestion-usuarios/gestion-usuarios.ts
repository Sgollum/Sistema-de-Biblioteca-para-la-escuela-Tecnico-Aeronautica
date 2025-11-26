import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../app/core/services/user.service'; // Asegúrate de que la ruta es correcta
import { Usuario } from '../../../app/core/models/usuario.model'; // Asegúrate de que la ruta es correcta
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
// Importa el módulo de la tabla si lo tienes, por ahora solo CommonModule

// -----------------------------------------------------
// 1. CORRECCIÓN: Definir un tipo extendido para el modal
// -----------------------------------------------------
// Extendemos la interfaz Usuario para añadir la propiedad temporal que
// usamos en el modal para saber qué acción ejecutar ('delete' o 'toggle').
interface UsuarioConAccion extends Usuario {
  actionType: 'toggle' | 'delete';
}


@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  // Necesitas importar CommonModule para *ngIf y *ngFor
  imports: [CommonModule], 
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuariosComponent implements OnInit {

  // Inyección de dependencias usando 'inject'
  private router = inject(Router);
  private userService = inject(UserService); 
  
  // Lista de usuarios (cargada de la API)
  usuarios: Usuario[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  actionMessage: string | null = null; 
  // 2. CORRECCIÓN: Usar el nuevo tipo extendido para userToConfirm
  userToConfirm: UsuarioConAccion | null = null; // Usuario seleccionado para eliminación/desactivación

  // Mapeo de Roles para la UI (ajusta si los roles de Django son diferentes a estos)
  rolDisplay = {
    'admin': 'Administrador',
    'bibliotecario': 'Bibliotecario',
    'lector': 'Lector',
    // Si tu modelo tiene roles en mayúsculas, ajusta aquí:
    // 'ADMINISTRADOR': 'Administrador',
  };

  ngOnInit(): void {
    this.loadUsuarios();
  }

  /**
   * Carga la lista de usuarios desde la API.
   */
  loadUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getUsers().pipe(
      // El handleError del servicio devolverá un 'of([])' en caso de error
      // pero aún podemos capturarlo para mostrar el mensaje de error personalizado aquí
      catchError((error: HttpErrorResponse | any) => {
        this.errorMessage = `Error al cargar usuarios. Intenta de nuevo. Detalles: ${error.message || error.statusText}`;
        this.isLoading = false;
        // Lanzamos el error de nuevo para que el pipe se maneje internamente
        return []; 
      })
    ).subscribe(data => {
      this.usuarios = data;
      this.isLoading = false;
    });
  }

  // Navegar a la página de creación de usuario
  crearUsuario(): void {
    this.router.navigate(['/admin/usuarios/crear']); 
  }

  // Navegar a la página de edición de usuario
  editarUsuario(id: number): void {
    this.router.navigate(['/admin/usuarios/editar', id]); 
  }

  // -----------------------------------------------------------
  // Lógica de ACCIONES REALES (Activar/Desactivar/Eliminar)
  // -----------------------------------------------------------

  /**
   * Muestra el modal de confirmación antes de la acción crítica.
   * @param usuario El usuario a modificar/eliminar.
   * @param action La acción a confirmar ('toggle' o 'delete').
   */
  confirmAction(usuario: Usuario, action: 'toggle' | 'delete'): void {
    // 3. CORRECCIÓN: Al asignar, forzamos el tipo a 'UsuarioConAccion'
    this.userToConfirm = {...usuario, actionType: action} as UsuarioConAccion; 
  }

  /**
   * Confirma y ejecuta la acción pendiente.
   */
  executeConfirmedAction(): void {
    if (!this.userToConfirm) return;

    const user = this.userToConfirm;
    // user.actionType ya no da error porque 'user' es de tipo UsuarioConAccion
    const actionType = user.actionType;

    if (actionType === 'toggle') {
      this.toggleActive(user);
    } else if (actionType === 'delete') {
      this.eliminarUsuario(user.id);
    }
    
    this.userToConfirm = null; // Cierra el modal de confirmación
  }

  /**
   * Invierte el estado 'activo' del usuario usando el servicio.
   * @param usuario El usuario a modificar.
   */
  private toggleActive(usuario: Usuario): void {
    const nuevoEstado = !usuario.is_active;
    const updates = { is_active: nuevoEstado };

    this.userService.updateUser(usuario.id, updates).subscribe({
      next: (updatedUser) => {
        // Actualiza el usuario en la lista local 
        // Primero, encontramos el usuario en la lista principal (usuarios[]) que es de tipo Usuario[]
        const index = this.usuarios.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            this.usuarios[index].is_active = updatedUser.is_active;
        }

        const action = updatedUser.is_active ? 'habilitada' : 'deshabilitada';
        this.showActionMessage(`Cuenta de ${updatedUser.first_name} ${updatedUser.last_name} ha sido ${action}.`, 'success');
      },
      error: (err) => {
        this.showActionMessage(`Error al cambiar el estado: ${err.message}`, 'error');
      }
    });
  }
  
  /**
   * Elimina el usuario usando el servicio.
   * @param id ID del usuario a eliminar.
   */
  private eliminarUsuario(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        // Elimina el usuario de la lista local
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.showActionMessage(`Usuario ID: ${id} eliminado correctamente.`, 'success');
      },
      error: (err) => {
        this.showActionMessage(`Error al eliminar el usuario: ${err.message}`, 'error');
      }
    });
  }

  /**
   * Muestra un mensaje de acción (simulando un Snackbar o Toast).
   * @param message Mensaje a mostrar.
   * @param type Tipo de mensaje (success o error).
   */
  showActionMessage(message: string, type: 'success' | 'error'): void {
    this.actionMessage = message;
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Opcional: Ocultar el mensaje después de 5 segundos
    setTimeout(() => this.actionMessage = null, 5000);
  }
}