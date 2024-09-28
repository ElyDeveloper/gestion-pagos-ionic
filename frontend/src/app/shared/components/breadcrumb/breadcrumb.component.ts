import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-breadcrumb",
  template: `
    <ion-breadcrumbs class="mt-5 pt-3 ">
      <ion-breadcrumb (click)="goTo('/home')" class="breadcrumb-clickable">
        <ion-icon slot="start" name="home"></ion-icon>
        Inicio
      </ion-breadcrumb>
      <ion-breadcrumb
        *ngFor="let segment of segments"
        (click)="goTo(segment)"
        class="breadcrumb-clickable">
        {{ segment }}
      </ion-breadcrumb>
    </ion-breadcrumbs>
  `,
  styles: [
    ".breadcrumb-clickable { cursor: pointer; transition: transform 0.2s ease; &:hover {transform: scale(1.05);}}",
  ],
})
export class BreadcrumbComponent implements OnInit {
  segments: any[] = [];

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  constructor() {}

  ngOnInit() {
    //Obtener Url

    const url = this.getCurrentUrl();
    this.segments = url.split("/"); // Dividir la URL en segmentos
    //Eliminar primeros dos elementos del array
    this.segments = this.segments.slice(2);

    //Si hay mas de 1 segmento, eliminar el ultimo
    if (this.segments.length > 1) {
      this.segments.pop();
    }

    // //console.log("Segmentos: ", this.segments);
    //Si el segmento es igual a home eliminarlo
    if (this.segments[0] === "home") {
      this.segments = [];
    }
  }

  goTo(url: string) {
    this._router.navigateByUrl("/layout/" + url);
  }

  getCurrentUrl() {
    return this._router.url;
  }
}
