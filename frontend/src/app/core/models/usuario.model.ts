export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'bibliotecario' | 'lector';
  is_active: boolean; // Para habilitar/deshabilitar usuarios
}

// Interfaz para el objeto que enviaremos al crear un nuevo usuario
export interface NuevoUsuario {
  username: string;
  email: string;
  password?: string; // Opcional si el backend genera un temporal
  first_name: string;
  last_name: string;
  role: 'admin' | 'bibliotecario' | 'lector';
}