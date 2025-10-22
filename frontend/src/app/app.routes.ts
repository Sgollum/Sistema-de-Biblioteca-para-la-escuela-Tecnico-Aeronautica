// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
// Importamos los componentes Login y Home
import { LoginComponent } from './pages/login/login.component'; 
import { HomeComponent } from './pages/home/home'; // NUEVA IMPORTACIÓN

export const routes: Routes = [
    // La ruta base (/) ahora muestra el componente Home
    { path: '', component: HomeComponent }, 
    
    // Si la ruta es '/login', muestra el Login
    { path: 'login', component: LoginComponent },
    
    // Opcional: Redirigir cualquier ruta desconocida (404) a la principal
    { path: '**', redirectTo: '' }
];