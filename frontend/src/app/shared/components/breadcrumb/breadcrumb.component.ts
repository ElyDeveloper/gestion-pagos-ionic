import { Component, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);

  segments: any[] = [];

  constructor() {}

  ngOnInit() {
    // Suscribirse a los eventos del router para capturar cambios en la URL
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd) // Filtrar solo los eventos de finalización de navegación
      )
      .subscribe(() => {
        const url = this.router.url; // Obtener la URL actual
        this.segments = url.split("/"); // Dividir la URL en segmentos
        //Eliminar primeros dos elementos del array
        this.segments = this.segments.slice(2);

        //Si el segmento es igual a home eliminarlo
        if (this.segments[0] === "home") {
          this.segments = [];
        }

        console.log("Segments: ", this.segments); // Loggear los segmentos
      });
  }


  
}
