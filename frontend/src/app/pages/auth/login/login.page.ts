import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:any={}

  router = inject(Router);
  constructor() { }

  ngOnInit() {
  }

  async login() {
    //Redirection a la home
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });

    this.router.navigate(['/layout']);

  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

}
