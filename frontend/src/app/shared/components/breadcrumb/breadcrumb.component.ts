import { Component, inject, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, Subscription } from "rxjs";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);

  segments: any[] = [];

  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    // Suscribirse a los eventos del router para capturar cambios en la URL
    this.subscriptions = [];
    this.subscriptions.push(
      this.router.events
        .pipe(
          filter((event: any) => event instanceof NavigationEnd) // Filtrar solo los eventos de finalización de navegación
        )
        .subscribe(() => {
          const url = this.router.url; // Obtener la URL actual
          this.segments = (url.split("/")); // Dividir la URL en segmentos
          //Eliminar primeros dos elementos del array
          this.segments = this.segments.slice(2);

          //Si hay mas de 1 segmento, eliminar el ultimo
          if (this.segments.length > 1) {
            this.segments.pop();
          }

          console.log("Segmentos: ", this.segments);
          //Si el segmento es igual a home eliminarlo
          if (this.segments[0] === "home") {
            this.segments = [];
          }
        })
    );
  }

  goTo(url: string) {
    this.router.navigateByUrl("/layout/" + url);
  }

  ngOnDestroy() {
    //Ver cantidad de suscripciones
    console.log("Suscripciones activas: ", this.subscriptions.length);
    // Desuscribirse de todos los eventos al destruir el componente
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
