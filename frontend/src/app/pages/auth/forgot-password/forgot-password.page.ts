import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  validateForm!: FormGroup
  userEmail: string = '';

  private router = inject(Router);
  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null]
    });
  }

  resetPassword() {
    // Implementar lógica para enviar instrucciones de recuperación de contraseña
    console.log('Enviando instrucciones a:', this.userEmail);
    // Aquí iría la lógica para enviar el email de recuperación
    this.globalService.Post('send-email', {
      identificator: this.userEmail,
      option: 1,
    }).subscribe((result:any)=>{
      if(result.error){
        alert(result.error);
      }else{
        alert('Se ha enviado un correo con las instrucciones para recuperar la contraseña');
      }
    })
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}
