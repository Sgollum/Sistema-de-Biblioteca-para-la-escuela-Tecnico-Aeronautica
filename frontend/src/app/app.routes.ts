// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing'; // Importar Landing
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home'; // Tu dashboard

// Aquí podrías crear un AuthGuard para proteger rutas como el dashboard
// import { AuthGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
    {
        path: '', // La raíz de la aplicación
        component: LandingComponent,
        title: 'Bienvenido'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Iniciar Sesión'
    },
    {
        path: 'dashboard', // Ruta específica para el dashboard
        component: HomeComponent,
        title: 'Dashboard de Administración',
        // canActivate: [AuthGuard] // Proteger esta ruta en el futuro
    },
    {
        path: '**', // Ruta comodín para cualquier otra URL
        redirectTo: '' // Redirigir a la página de inicio
    }
];