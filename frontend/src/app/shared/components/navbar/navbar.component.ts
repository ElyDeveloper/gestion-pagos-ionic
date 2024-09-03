import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Usuario } from "../../interfaces/usuario";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
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
    this._cookieService.deleteAll();
    this.router.navigate(["/login"]);
  }
}
