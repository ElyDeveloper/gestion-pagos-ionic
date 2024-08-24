import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, Subscription } from "rxjs";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
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

    console.log("Segmentos: ", this.segments);
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
