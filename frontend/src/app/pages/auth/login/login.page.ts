import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  login() {
    //Redirection a la home
    this.router.navigate(['/home']);

  }

}
