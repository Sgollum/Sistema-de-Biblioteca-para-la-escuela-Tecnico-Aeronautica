import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario, NuevoUsuario } from '../models/usuario.model';
import { environment } from '../../../enviroments/enviroment'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // URL base del API de Usuarios (Asegúrate de cambiar esto por la URL real de tu Django/Backend)
  private usersUrl = `${environment.apiUrl}/api/usuarios/`; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los usuarios del sistema.
   * @returns Observable con la lista de usuarios.
   */
  getUsers(): Observable<Usuario[]> {
    console.log(`Llamando a la API: GET ${this.usersUrl}`);
    return this.http.get<Usuario[]>(this.usersUrl)
      .pipe(
        tap(users => console.log('Usuarios obtenidos con éxito')),
        catchError(this.handleError<Usuario[]>('getUsers', []))
      );
  }

  /**
   * Crea un nuevo usuario en el sistema.
   * @param user - Objeto con los datos del nuevo usuario.
   * @returns Observable con el usuario creado.
   */
  createUser(user: NuevoUsuario): Observable<Usuario> {
    console.log(`Llamando a la API: POST ${this.usersUrl}`, user);
    return this.http.post<Usuario>(this.usersUrl, user)
      .pipe(
        tap((newUser: Usuario) => console.log(`Usuario creado, id=${newUser.id}`)),
        catchError(this.handleError<Usuario>('createUser'))
      );
  }

  /**
   * Actualiza el estado (activo/inactivo) o el rol de un usuario.
   * @param userId - ID del usuario a actualizar.
   * @param updates - Objeto con los campos a actualizar (ej: { is_active: false } o { role: 'admin' }).
   * @returns Observable con el usuario actualizado.
   */
  updateUser(userId: number, updates: Partial<Usuario>): Observable<Usuario> {
    const url = `${this.usersUrl}${userId}/`;
    console.log(`Llamando a la API: PATCH ${url}`, updates);
    return this.http.patch<Usuario>(url, updates)
      .pipe(
        tap(() => console.log(`Usuario actualizado, id=${userId}`)),
        catchError(this.handleError<Usuario>('updateUser'))
      );
  }

  /**
   * Elimina un usuario del sistema.
   * @param userId - ID del usuario a eliminar.
   * @returns Observable que indica el éxito de la operación.
   */
  deleteUser(userId: number): Observable<any> {
    const url = `${this.usersUrl}${userId}/`;
    console.log(`Llamando a la API: DELETE ${url}`);
    return this.http.delete(url)
      .pipe(
        tap(() => console.log(`Usuario eliminado, id=${userId}`)),
        catchError(this.handleError<any>('deleteUser'))
      );
  }

  /**
   * Maneja errores de la operación Http.
   * @param operation - Nombre de la operación que falló.
   * @param result - Valor opcional a retornar para que la app continúe.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error);
      // Podemos transformar el error para mostrar un mensaje amigable al usuario
      return of(result as T);
    };
  }
}