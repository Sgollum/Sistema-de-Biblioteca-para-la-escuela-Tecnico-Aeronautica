import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Interfaces de datos (MOCK)
interface Seguridad {
  alertas: number;
  intentosFallidosHoy: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {

  // Kpis de Usuario
  totalUsuarios: number = 1234;
  
  // Datos de Roles (MOCK para el gráfico)
  rolesData = {
    administradores: 5,
    bibliotecarios: 35,
    lectores: 1194,
  };

  // Resumen de Seguridad (MOCK)
  resumenSeguridad: Seguridad = {
    alertas: 0,
    intentosFallidosHoy: 5
  };

  constructor() { }

  ngOnInit(): void {
    // Inicializar el gráfico al cargar el componente
    this.createRoleChart();
  }
  
  // Lógica para crear el gráfico de pastel de roles
  createRoleChart() {
    const ctx = document.getElementById('roleChart') as HTMLCanvasElement;

    // Asegúrate de que el canvas exista antes de intentar crear el gráfico
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Administradores', 'Bibliotecarios', 'Lectores'],
          datasets: [{
            label: 'Conteo de Roles',
            data: [this.rolesData.administradores, this.rolesData.bibliotecarios, this.rolesData.lectores],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)', // Rojo para Admin
              'rgba(54, 162, 235, 0.7)', // Azul para Bibliotecario
              'rgba(75, 192, 192, 0.7)'  // Verde/Cian para Lector
            ],
            borderColor: [
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: 'Inter, sans-serif'
                }
              }
            },
            title: {
              display: false, // El título va en el HTML
            }
          }
        }
      });
    }
  }

  crearNuevoUsuario(): void {
    // Redirigir al formulario de registro (o a un formulario interno para el admin)
    alert('Redireccionando a "Crear Nuevo Usuario"...');
    // this.router.navigate(['/registro']); 
  }

  verReporteActividad(): void {
    // Redirigir a la vista de reportes del sistema
    alert('Redireccionando a "Reporte de Actividad"...');
    // this.router.navigate(['/reportes']);
  }
}