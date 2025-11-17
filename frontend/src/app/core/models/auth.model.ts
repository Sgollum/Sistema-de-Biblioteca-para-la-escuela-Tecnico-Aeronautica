// Interfaces de modelos para la autenticación

/**
 * Interface para los datos de inicio de sesión.
 * Asume que el backend de Django espera 'username' y 'password'.
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interface para los datos de registro de usuario.
 * Puede incluir campos adicionales como email.
 */
export interface RegisterCredentials {
  nombre: string;
  username: string;
  email: string;
  password: string;
  password2: string; // Confirmación de contraseña
}

/**
 * Interface para el Token de Autenticación retornado por el API de Django.
 * Si tu backend Django usa un token simple, solo necesitas 'token'.
 * Si usa Djoser o Simple JWT, podrías tener 'access' y 'refresh'.
 * Aquí usamos 'token' para simplificar, que es lo que espera el AuthService.
 */
export interface AuthToken {
  token: string;
  // Opcional: si tu API usa tokens con vencimiento (ej. Simple JWT)
  // access?: string;
  // refresh?: string;
}