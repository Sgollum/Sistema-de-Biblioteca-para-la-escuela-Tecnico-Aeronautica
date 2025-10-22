import { Routes } from '@angular/router';
// 💡 Ruta de Importación CORREGIDA: Apunta al archivo .component
import { LoginComponent } from './pages/login/login.component'; 

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    { path: 'login', component: LoginComponent },
];