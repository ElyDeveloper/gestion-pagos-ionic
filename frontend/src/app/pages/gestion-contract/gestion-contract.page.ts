import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { GlobalService } from "src/app/shared/services/global.service";
import { environment } from "src/environments/environment";
const COMPANY = environment.company || "No Aún";
@Component({
  selector: "app-gestion-contract",
  templateUrl: "./gestion-contract.page.html",
  styleUrls: ["./gestion-contract.page.scss"],
})
export class GestionContractPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  isModalOpen = false;
  isToastOpen = false;
  isEdit = false;
  hasAval = false;

  editarBancoDepositar: boolean = false;
  editarCuentaBancaria: boolean = false;
  editarCiudadBanco: boolean = false;
  editarDireccionEmpresa: boolean = false;
  editarFechaAcuerdo: boolean = false;

  nombreEmpresa: string = COMPANY;
  bancoDepositar: string = "";
  ciudadBanco: string = "";
  cuentaBancaria: string = "";
  direccionEmpresa: string = "";
  fechaAcuerdo: string = "";

  textLoader: string = "Cargando...";
  toastMessage: string = "cliente guardado correctamente";
  title: string = "Todos";
  action: string = "todos";

  clienteSeleccionado: any = null;
  avalSeleccionado: any = null;
  prestamoSeleccionado: any = {};

  private _router = inject(Router);
  private _globalService = inject(GlobalService);
  private _route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {
    this.getPrestamo();
  }
  getPrestamo() {
    //Obtener id de la url
    this._route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this._globalService.GetByIdEncrypted("prestamos", id).subscribe({
          next: (prestamo: any) => {
            if (prestamo) {
              prestamo = this._globalService.parseObjectDates(prestamo);
              console.log("Prestamo: ", prestamo);
              this.prestamoSeleccionado = prestamo;
              this.clienteSeleccionado = prestamo.cliente;
              this.avalSeleccionado = prestamo.aval;
              if (prestamo.idAval) {
                this.hasAval = true;
              }
              console.log("Plan de Pago: ", prestamo.planPago);

              this.isEdit = true;
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.prestamoSeleccionado = null;
        this.isEdit = false;
      }
    });
  }

  toLowerCase(texto: string): string {
    if (texto) {
      return texto.toLowerCase();
    } else {
      return "No aún";
    }
  }

  formatDate(fechaStr: string): string {
    // console.log('FEcha: ', fechaStr)
    if (fechaStr) {
      const fecha = fechaStr.split("-");
      const dia = parseInt(fecha[2]);
      const mes = this.getNombreMes(parseInt(fecha[1]) - 1);
      const anio = parseInt(fecha[0]);
      return `${dia} de ${mes} del año ${anio}`;
    }

    return "No aún";
  }

  private getNombreMes(mes: number): string {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return meses[mes];
  }

  convertirNumero(numero: number): string {
    if (numero) {
      return this._globalService.numberToText(numero);
    } else {
      return "No aún";
    }
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }
}
