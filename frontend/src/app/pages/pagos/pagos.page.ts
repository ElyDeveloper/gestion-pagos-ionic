import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Pagos } from "src/app/shared/interfaces/pago";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-pagos",
  template: `
    <ion-content [fullscreen]="false">
      <app-wrapper> </app-wrapper>
      <section class="container">
        <app-view-data
          [showAdd]="false"
          [data]="elements"
          [columnsData]="columnsData"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          [title]="'Pagos'"
          [context]="'Pago'">
        </app-view-data>
      </section>
    </ion-content>
  `,
})
export class PagosPage implements OnInit {
  elements: Pagos[] = []; // Aquí puedes almacenar los elementos obtenidos
  suscriptions: Subscription[] = [];

  currentPage = 1;
  currentPageSize = 10;
  totalPages = 0;
  columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)

  private _globalService = inject(GlobalService);
  constructor() {}

  handleSave(data: any) {
    console.log("Datos guardados:", data);
    // Aquí puedes procesar los datos como necesites
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.buildColumns();
    this.getCountElements();
  }

  buildColumns() {
    this.columnsData = [
      {
        key: "cuota.id",
        alias: "ID Cuota",
      },
      {
        key: "monto",
        alias: "Monto Pago",
        type: "currency",
      },
      {
        key: "fechaPago",
        alias: "Fecha de Pago",
        type: "date",
      },
      {
        key: "cuota.planPago.prestamos.cliente.nombres",
        alias: "Nombre del Cliente",
      },
      {
        key: "cuota.planPago.prestamos.cliente.apellidos",
        alias: "Apellidos del Cliente",
      },
      {
        key: "cuota.planPago.prestamos.cliente.dni",
        alias: "DNI",
        type: "dni",
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Pagado", "Pendiente"],
      },
      {
        key: "cuota.planPago.prestamos.totalMonto",
        alias: "Monto Total del Préstamo",
      },
      {
        key: "cuota.planPago.cuotasPagar",
        alias: "Cuotas a Pagar",
      },
      {
        key: "cuota.planPago.cuotaPagadas",
        alias: "Cuotas Pagadas",
      },
      {
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Cargar Archivo - ",
            action: "upload",
            icon: "cloud-upload",
            color: "primary",
            rolesAuthorized: [1, 2, 3],
          },
          {
            alias: "Abrir Adjunto - ",
            action: "info",
            icon: "open",
            color: "secondary",
            rolesAuthorized: [1, 2],
          },
        ],
      },
    ];
  }
  getCountElements() {
    this._globalService.Get("pagos/count").subscribe({
      next: (response: any) => {
        console.log("Cantidad de elementos:", response.count);
        const totalElements = response.count;
        this.totalPages = Math.ceil(totalElements / this.currentPageSize);
        console.log("Total de páginas:", this.totalPages);
        this.getElementsPag();
      },
      error: (error) => {
        console.error("Error al obtener la cantidad de elementos:", error);
      },
    });
  }

  getElementsPag() {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    this._globalService
      .Get(`pagos/paginated?skip=${skip}&limit=${limit}`)
      .subscribe({
        next: (response: any) => {
          console.log("Element os obtenidos:", response);
          this.elements = response;

          this.elements.forEach((element: any) => {
            element.cuota.planPago.prestamos =
              element.cuota.planPago.prestamos[0];
          });
        },
        error: (error) => {
          console.error("Error al obtener los elementos:", error);
        },
      });
  }

  ionViewDidLeave() {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }
}
