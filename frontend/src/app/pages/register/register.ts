import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {

  // --- PROPIEDADES DE MODELO (Para que coincidan con [(ngModel)] en el HTML) ---
  // Los errores indicaban que el template busca estas propiedades individuales.
  username: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  rol: 'lector' | 'bibliotecario' | 'admin' = 'lector'; // Asumo el rol por defecto.

  // --- PROPIEDADES DE ESTADO (Para que coincidan con *ngIf y {{}} en el HTML) ---
  registerError: string = '';
  registerSuccess: string = '';
  
  constructor() { }

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  /**
   * CRÍTICO: Renombrada de 'registrar' a 'onRegister' para coincidir con (ngSubmit) en el template.
   */
  onRegister(): void {
    this.registerError = ''; // Limpiar errores anteriores
    this.registerSuccess = ''; // Limpiar éxito anterior

    if (this.password !== this.passwordConfirm) {
        this.registerError = 'Las contraseñas no coinciden.';
        return;
    }

    // Aquí iría la lógica de autenticación o llamada a un servicio.
    console.log('Datos de registro enviados:');
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Rol:', this.rol);

    // Simulación de registro exitoso
    this.registerSuccess = `Usuario ${this.username} registrado exitosamente como ${this.rol}.`;
  }
}