import { Component, inject } from "@angular/core";
import { Platform } from "@ionic/angular";
import { BackdropFixService } from "./shared/services/backdrop-fix.service";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  darkMode: boolean = true;

  public appPages = [
    { title: "Inicio", url: "/layout/home", icon: "home" },
    { title: "Usuarios", url: "/layout/usuarios", icon: "people" },
    { title: "Clientes/Avales", url: "/layout/personas", icon: "person" },
    {
      title: "Contratos Pagos",
      url: "/layout/contratos-pago",
      icon: "document-text",
    },
    { title: "Préstamos", url: "/layout/prestamos", icon: "cash" },
    { title: "Pagos", url: "/layout/pagos", icon: "card" },
    { title: "Reportes", url: "/layout/reportes", icon: "stats-chart" },
  ];

  private backdropFixService = inject(BackdropFixService);
  private _titleService = inject(Title);

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkDarkMode();
    });

    this._titleService.setTitle(environment.appName || "LAP");

    this.backdropFixService.startObserving();
  }

  checkDarkMode() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    // //console.log(prefersDark);
    this.darkMode = prefersDark.matches;
    //Verificar si hay una configuración previa
    const darkMode = localStorage.getItem("themeApp");
    if (darkMode) {
      this.darkMode = darkMode === "dark";
      // //console.log(this.darkMode);
    }

    if (this.darkMode) {
      document.body.classList.toggle("dark");
    }
  }

  cambioApariencia() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark");
    //Guardar en localstorage
    localStorage.setItem("themeApp", this.darkMode ? "dark" : "light");
  }
}
