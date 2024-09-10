import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Usuario } from "../../interfaces/usuario";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-navbar",
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title size="large" class="ion-hide-md-down"
          >{{ appName }}
        </ion-title>
        <!-- Título para móviles -->
        <ion-title size="medium" class="ion-hide-md-up">FICRE</ion-title>
        <!-- Visualizar foto de usuario -->
        <ion-avatar slot="end">
          <img
            src="https://ionicframework.com/docs/demos/api/avatar/avatar.svg" />
        </ion-avatar>
        <!-- Desplegable para cerrar sesión -->
        <ion-buttons slot="end">
          <ion-button (click)="setOpen(true)">
            <span class="ion-hide-md-down"
              >{{ user.nombre }} {{ user.apellido }}
            </span>
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-action-sheet
      [isOpen]="isActionSheetOpen"
      header="Opciones"
      [buttons]="actionSheetButtons"
      (didDismiss)="setOpen(false)"></ion-action-sheet>
  `,
})
export class NavbarComponent implements OnInit {
  selectionProfile: any;
  appName: string = environment.appName;
  user: Usuario = {
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    observacion: "",
    ad: false,
    estado: false,
    changedPassword: false,
    rolid: 0,
    rol: {
      id: 0,
      nombre: "",
    },
  };

  isActionSheetOpen = false;

  public actionSheetButtons = [
    {
      text: "Cerrar Sesión",
      role: "destructive",
      handler: () => {
        this.logout();
      },
      data: {
        action: "logout",
      },
    },
    {
      text: "Cancel",
      role: "cancel",
      data: {
        action: "cancel",
      },
    },
  ];

  private router = inject(Router);
  private _authService = inject(AuthService);
  private _cookieService = inject(CookieService);

  constructor() {}

  ionViewWillEnter() {
    this.selectionProfile = "";
  }

  ngOnInit() {
    this.getUserLogged();
  }

  getUserLogged() {
    this._authService.getUserInfo().subscribe({
      next: (user: any) => {
        this.user = user;
      },
      error: (error) => {
        console.error("Error al obtener usuario logueado", error);
      },
    });
  }

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  logout() {
    console.log("logout");
    //Eliminar las cookies
    this._cookieService.delete("tokensession");
    this.router.navigate(["/login"]);
  }
}
