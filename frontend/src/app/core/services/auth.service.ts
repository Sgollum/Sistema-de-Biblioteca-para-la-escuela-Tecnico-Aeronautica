import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
// Asumimos que LoginCredentials tiene campos como: { identifier: string; password: string; }
import { AuthToken, LoginCredentials, RegisterCredentials } from '../models/auth.model'; 

interface UserInfo {
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly tokenKey = 'authToken';
  private readonly roleKey = 'userRole';

  private apiUrlBase = 'http://localhost:8000';

  public readonly Roles = {
    ADMIN: 'admin',
    BIBLIOTECARIO: 'bibliotecario',
    LECTOR: 'lector',
    GUEST: 'guest'
  };

  constructor() {
    if (this.isBrowser) {
      if (this.isLoggedIn() && !this.getCurrentUserRole()) {
        this.fetchUserInfo().subscribe();
      }
    }
  }

  // LOGIN
  login(credentials: LoginCredentials): Observable<AuthToken> {
    // 🚨 CAMBIO CRÍTICO: La URL ahora apunta a la vista personalizada
    const url = `${this.apiUrlBase}/api/usuarios/login/`; 
    
    // El payload ya estaba correcto:
    const djangoPayload = {
      identifier: credentials.identifier, 
      password: credentials.password 
    };

    return this.http.post<AuthToken>(url, djangoPayload).pipe(
      tap(response => {
        this.saveToken(response.token);
        // Si la respuesta incluye el rol (como en tu LoginView), podemos usarlo directamente:
        if ('rol' in (response as any)) {
            this.saveUserRole((response as any).rol);
        } else {
             // Si no, volvemos a obtener la info (mejor dejar solo este)
             this.fetchUserInfo().subscribe();
        }
      })
    );
  }

  // INFO DEL USUARIO
  fetchUserInfo(): Observable<UserInfo> {
    const url = `${this.apiUrlBase}/api/usuarios/me/`;
    return this.http.get<UserInfo>(url).pipe(
      tap(userInfo => {
        this.saveUserRole(userInfo.rol);
      })
    );
  }

  // REGISTRO
  registerUser(credentials: RegisterCredentials): Observable<any> {
    const url = `${this.apiUrlBase}/api/usuarios/register/`;
    return this.http.post<any>(url, credentials);
  }

  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  saveUserRole(rol: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.roleKey, rol);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 💡 CORRECCIÓN DE TIPO: Asumo que UserRole es un tipo que definiste.
  // Si no definiste UserRole, reemplaza ': UserRole' por ': string'.
  getCurrentUserRole(): string {
    if (this.isBrowser) {
      const role = localStorage.getItem(this.roleKey) as string; 
      // Si el rol es nulo, devuelve GUEST
      return role ?? this.Roles.GUEST; 
    }
    return this.Roles.GUEST;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.roleKey);
    }
  }
}