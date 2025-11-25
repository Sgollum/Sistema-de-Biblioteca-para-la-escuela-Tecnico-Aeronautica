import { Interface } from "readline";

export type UserRole = 'Lector' | 'Bibliotecario' | 'Admin' | 'guest' ;

export interface LoginCredentials {
identifier: string; 
password: string;
}
export interface RegisterCredentials {
    username: string;
    email: string;
    first_name?: string; 
    last_name?: string; 
    rol?: UserRole;    
    password1: string;
    password2: string; 

}
export interface AuthToken {
token: string;
}

// Estructura del objeto devuelto por /api/usuarios/me/
export interface User {
id: number;
username: string;
email: string;
first_name: string;
last_name: string;
rol: UserRole;
}