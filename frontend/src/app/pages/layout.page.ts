import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  user = {
    name: 'John Doe',
    email: 'john@gmail.com',
  }
  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    if (!this.folder) {
      this.folder = 'Bienvenido';
    }
  }

  logout() {
    console.log('logout');
    this.router.navigate(['/login']);
  }

  getSelection(event:any) {
    const selection = event.detail.value;

    switch (selection) {
      case 'logout':
        this.logout();
        break;
      default:
        break
    }
    
  }

}