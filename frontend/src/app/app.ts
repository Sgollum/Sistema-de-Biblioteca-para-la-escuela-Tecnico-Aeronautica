import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { HomeComponent } from './pages/home/home';
import { LibroFormComponent } from './pages/libro-form/libro-form';
import { Layout } from './shared/layout/layout';
import { LectorDashboardComponent } from './pages/lector-dashboard/lector-dashboard';
import { BibliotecarioDashboardComponent } from './pages/bibliotecario-dashboard/bibliotecario-dashboard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios'; 
import { UsuarioForm } from './pages/usuario-form/usuario-form'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HttpClientModule, 
    FormsModule, 
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LibroFormComponent,
    Layout, 
    LectorDashboardComponent,
    BibliotecarioDashboardComponent,
    AdminDashboardComponent,
    GestionUsuariosComponent, 
    UsuarioForm,     
  ],
  template: `
    <!-- La directiva RouterOutlet se encarga de mostrar el componente de la ruta activa -->
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'Biblioteca Digital DGAC';
}