import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Usuario } from "../../interfaces/usuario";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  selectionProfile: any;
  user: Usuario = {};

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
    this.router.navigate(["/login"]);
  }
}
