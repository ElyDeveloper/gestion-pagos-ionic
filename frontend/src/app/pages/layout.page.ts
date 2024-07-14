import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
  selectionProfile: any;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  user = {
    name: 'John Doe',
    email: 'john@gmail.com',
  }

  segments: any[] = [];

  
  constructor() { }
  
  ionViewWillEnter() {
    this.selectionProfile = '';
  }

  ngOnInit() {
     // Suscribirse a los eventos del router para capturar cambios en la URL
  this.router.events
  .pipe(
    filter((event:any) => event instanceof NavigationEnd) // Filtrar solo los eventos de finalización de navegación
  )
  .subscribe(() => {
    const url = this.router.url; // Obtener la URL actual
    this.segments = url.split('/'); // Dividir la URL en segmentos
    //Eliminar primeros dos elementos del array
    this.segments = this.segments.slice(2);

    //Si el segmento es igual a home eliminarlo
    if (this.segments[0] === 'home') {
      this.segments = [];
    }
    
    console.log('Segments: ', this.segments); // Loggear los segmentos
  });
  }

  logout() {
    console.log('logout');
    this.router.navigate(['/login']);
  }

  getSelection() {
    switch (this.selectionProfile) {
      case 'logout':
        this.logout();
        break;
      default:
        break
    }
    
  }

}
