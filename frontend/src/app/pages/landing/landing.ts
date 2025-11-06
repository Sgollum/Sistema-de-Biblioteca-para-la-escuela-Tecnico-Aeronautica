// frontend/src/app/pages/landing/landing.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [], 
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {

  constructor(private router: Router) {} 

  goToLogin() {
    this.router.navigate(['/login']); 
  }
}