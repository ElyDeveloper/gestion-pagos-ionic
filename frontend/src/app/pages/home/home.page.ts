import { Component, ViewChild, TemplateRef, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { GlobalService } from "src/app/shared/services/global.service";

interface Folder {
  name: string;
  count: number;
  url: string; // Ruta a la página de la carpeta, sin el slash inicial
  rolesAuthorized: number[]; // Roles permitidos para acceder a la carpeta (1: admin, 2: usuario, etc.)
}

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  folders: Folder[] = [
    {
      name: "Usuarios",
      count: 0,
      url: "/layout/usuarios",
      rolesAuthorized: [1],
    },
    {
      name: "Clientes/Avales",
      count: 0,
      url: "/layout/personas",
      rolesAuthorized: [1, 2, 3],
    },
    {
      name: "Contratos Pago",
      count: 0,
      url: "/layout/contratos-pago",
      rolesAuthorized: [1, 2],
    },
    {
      name: "Prestamos",
      count: 0,
      url: "/layout/prestamos",
      rolesAuthorized: [1, 2, 3],
    },
    { name: "Pagos", count: 0, url: "/layout/pagos", rolesAuthorized: [1, 2] },
    {
      name: "Reportes",
      count: 0,
      url: "/layout/reportes-pagos",
      rolesAuthorized: [1, 2],
    },
  ];

  userLogged: any = {};
  suscriptions: Subscription[] = [];

  private navCtrl = inject(NavController);
  private _globalService = inject(GlobalService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    this.getUserLoggedIn();
  }

  ionViewWillEnter() {
    this.updateFolderCounts();
  }

  ionViewWillLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
    this.suscriptions = [];
  }

  getUserLoggedIn() {
    this._authService.getUserInfo().subscribe({
      next: (user: any) => {
        this.userLogged = user;
        console.log("User logged: ", this.userLogged);
      },
      error: (error) => {
        console.error("Error al obtener usuario logueado", error);
        this._router.navigate(["/login"]);
      },
    });
  }

  async updateFolderCounts() {
    this.suscriptions.push(
      this._globalService.Get("usuarios/count").subscribe({
        next: (data: any) => {
          this.folders[0].count = data.count;
        },
        error: (error) => {
          console.error("Error al obtener la cantidad de usuarios", error);
        },
      })
    );
    this.suscriptions.push(
      this._globalService.Get("personas/count").subscribe({
        next: (data: any) => {
          this.folders[1].count = data.count;
        },
        error: (error) => {
          console.error("Error al obtener la cantidad de clientes", error);
        },
      })
    );

    // this._globalService.Get("contratos-pago/count").subscribe({
    //   next: (data: any) => {
    //     this.folders[2].count = data.count;
    //   },
    //   error: (error) => {
    //     console.error("Error al obtener la cantidad de contratos de pago", error);
    //   },
    // });
    this.suscriptions.push(
      this._globalService.Get("prestamos/count").subscribe({
        next: (data: any) => {
          this.folders[3].count = data.count;
        },
        error: (error) => {
          console.error("Error al obtener la cantidad de prestamos", error);
        },
      })
    );
  }

  openFolder(folderName: string) {
    console.log(`Abriendo carpeta: ${folderName}`);
    // Aquí puedes agregar la lógica para abrir cada carpeta
    // this.navCtrl.navigateForward(`/${folderName.toLowerCase()}`);
  }
}
