import { Component, ViewChild, TemplateRef, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController } from "@ionic/angular";
import { GlobalService } from "src/app/shared/services/global.service";

interface Folder {
  name: string;
  count: number;
  url: string; // Ruta a la página de la carpeta, sin el slash inicial
}

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  folders: Folder[] = [
    { name: "Usuarios", count: 0, url: "/layout/usuarios"},
    { name: "Clientes", count: 0, url: "/layout/clientes"},
    { name: "Contratos Pago", count: 0, url: "/layout/contratos-pago" },
    { name: "Prestamos", count: 0, url: "/layout/prestamos" },
    { name: "Pagos", count: 0, url: "/layout/pagos"},
    { name: "Reportes", count: 0, url: "/layout/reportes-pagos"},
  ];

  private navCtrl = inject(NavController);
  private _globalService = inject(GlobalService);

  constructor() {}

  ngOnInit(): void {
    this.updateFolderCounts();
  }

  async updateFolderCounts() {
    this._globalService.Get("usuarios/count").subscribe({
      next: (data: any) => {
        this.folders[0].count = data.count;
      },
      error: (error) => {
        console.error("Error al obtener la cantidad de usuarios", error);
      },
    });
    
  }

  openFolder(folderName: string) {
    console.log(`Abriendo carpeta: ${folderName}`);
    // Aquí puedes agregar la lógica para abrir cada carpeta
    // this.navCtrl.navigateForward(`/${folderName.toLowerCase()}`);
  }
}
