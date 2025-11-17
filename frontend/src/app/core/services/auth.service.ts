import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; 
import { isPlatformBrowser } from '@angular/common'; // CRÍTICO: Esta importación es necesaria para isPlatformBrowser
import { AuthToken, LoginCredentials, RegisterCredentials } from '../models/auth.model'; 

// Definición simple de la interfaz de Usuario
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
    
    // URL base del API. (Asegúrate que esta URL sea correcta)
    private apiUrlBase = 'http://localhost:8000'; 
    
    public readonly Roles = {
        ADMIN: 'admin',
        BIBLIOTECARIO: 'biblio', 
        LECTOR: 'lector',
        GUEST: 'guest'
    };

    constructor() { 
        if (this.isBrowser) {
            if (this.isLoggedIn() && !this.getCurrentUserRole()) {
                this.fetchUserInfo().subscribe({
                    error: (err) => console.error('Error al recargar info de usuario al inicio:', err)
                });
            }
        }
    }

    // ... (El resto de los métodos login, fetchUserInfo, registerUser, etc., son correctos)

    login(credentials: LoginCredentials): Observable<AuthToken> {
        const url = `${this.apiUrlBase}/api/login/`;
        return this.http.post<AuthToken>(url, credentials).pipe(
            tap(response => {
                this.saveToken(response.token);
                this.fetchUserInfo().subscribe({
                    error: (err) => console.error('Error al obtener info de usuario después del login:', err)
                });
            })
        );
    }

    fetchUserInfo(): Observable<UserInfo> {
        const url = `${this.apiUrlBase}/api/usuarios/me/`; 
        return this.http.get<UserInfo>(url).pipe(
            tap(userInfo => {
                this.saveUserRole(userInfo.rol); 
                console.log('Rol de usuario guardado:', userInfo.rol);
            })
        );
    }

    registerUser(credentials: RegisterCredentials): Observable<any> {
        const url = `${this.apiUrlBase}/api/usuarios/`;
        return this.http.post<any>(url, credentials);
    }

    saveToken(token: string): void {
        if (this.isBrowser) { 
            localStorage.setItem(this.tokenKey, token);
        }
    }

    saveUserRole(role: string): void {
        if (this.isBrowser) { 
            localStorage.setItem(this.roleKey, role);
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

    getCurrentUserRole(): string {
        if (this.isBrowser) { 
            return localStorage.getItem(this.roleKey) || this.Roles.GUEST;
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