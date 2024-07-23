import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { GlobalService } from 'src/app/shared/services/global.service';
import { CookieService } from 'ngx-cookie-service';
import { key } from 'src/app/libraries/key.library';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = {
    email: '',
    password: ''
  };
  isToastOpen: boolean = false;
  toastMessage: string = '';
  formErrors: any = {
    email: '',
    password: ''
  };

  _router = inject(Router);
  _globalService = inject(GlobalService);
  _cookieService = inject(CookieService);
  constructor() { }

  ngOnInit() {
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  async login() {
    if (this.validateForm()) {
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
      });

      //TODO: Conectar con el Backend
      // this._globalService.Post('login', this.user).subscribe(
      //   (result: any) => {
      //     if (result?.token) {
      //       this._cookieService.set("tokensession", result.token, key.TOKEN_EXPIRATION_TIME, '');
      //       localStorage.setItem('user', result.usuario);
      //       localStorage.setItem('rol', result.rol);
      //       setTimeout(() => {
      //         this.setOpenedToast(false);
      //         this.router.navigate(['/layout']);
      //       }, 2000);

      //     } else if (result.redirect && result.credentialsId) {
      //       this.router.navigate([result.redirect, result.credentialsId]);
      //     } else {
      //       this.toastMessage = 'Usuario o contraseña incorrectos.';
      //       this.setOpenedToast(true);
      //     }
      //   }
      // );

      // return;
      this.toastMessage = 'Bienvenido ' + this.user.email;
      this.setOpenedToast(true);

      setTimeout(() => {
        this.setOpenedToast(false);
        this._router.navigate(['/layout']);
      }, 2000);
    } else {
      this.toastMessage = 'Por favor, corrija los errores en el formulario.';
      this.setOpenedToast(true);
    }
  }

  goToForgotPassword() {
    this._router.navigate(['/forgot-password']);
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      email: '',
      password: ''
    };

    // Validación de email
    if (!this.user.email) {
      this.formErrors.email = 'El email es requerido.';
      isValid = false;
    } else if (!this.isValidEmail(this.user.email)) {
      this.formErrors.email = 'Por favor, ingrese un email válido.';
      isValid = false;
    }

    // Validación de contraseña
    if (!this.user.password) {
      this.formErrors.password = 'La contraseña es requerida.';
      isValid = false;
    } else if (this.user.password.length < 6) {
      this.formErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}