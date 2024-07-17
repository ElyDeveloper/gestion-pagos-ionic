import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  userEmail: string = '';

  private router = inject(Router);
  constructor() {}

  ngOnInit() {}

  resetPassword() {
    // Implementar lógica para enviar instrucciones de recuperación de contraseña
    console.log('Enviando instrucciones a:', this.userEmail);
    // Aquí iría la lógica para enviar el email de recuperación
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}
