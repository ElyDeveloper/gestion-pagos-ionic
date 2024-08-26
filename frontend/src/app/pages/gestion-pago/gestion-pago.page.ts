import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { FechasPagos } from "src/app/shared/interfaces/fecha-pago";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-gestion-pago",
  templateUrl: "./gestion-pago.page.html",
  styleUrls: ["./gestion-pago.page.scss"],
})
export class GestionPagoPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  elements: FechasPagos[] = [];
  columnsData: Column[] = [];

  prestamoSeleccionado: any = {};
  clienteSeleccionado: any = {};
  avalSeleccionado: any = {};
  pagoSeleccionado: any = {};

  hasAval: boolean = false;

  suscriptions: Subscription[] = [];

  formModels: FormModels;
  pagoForm: FormGroup;

  private _globalService = inject(GlobalService);
  private _route = inject(ActivatedRoute);
  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.pagoForm = this.formModels.pagoForm();
  }

  ngOnInit() {
    this.getIdByUrl();
    this.buildColumns();
  }

  save(data:any){}

  isSuccessState(): boolean {
    return this.clienteSeleccionado?.id && this.pagoForm.valid;
  }

  isWarningState(): boolean {
    return !this.clienteSeleccionado?.id || !this.pagoForm.valid;
  }

  getIdByUrl() {
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
              this.getFechasPago(this.prestamoSeleccionado);
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.prestamoSeleccionado = null;
      }
    });
  }

  ionViewWillEnter() {}
  ionViewWillLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
    this.suscriptions = [];
  }

  buildColumns() {
    this.columnsData = [
      { key: "numero", alias: "No. Cuota" },
      { key: "fechaPago", alias: "Fecha de Pago", type: "date" },
      { key: "cuota", alias: "Monto Cuota", type: "currency" },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Pagado", "Pendiente"],
      },
      {
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Seleccionar",
            action: "select",
            icon: "thumbs-up",
            color: "primary",
            rolesAuthorized: [1, 2],
          },
        ],
      },
    ];
  }

  onselectButtonClicked(data: any) {
    console.log("Elemento seleccionado:", data);
    
  }

  onUploaderChange(uploader: any) {
    console.log(uploader);
  }

  getFechasPago(data: any) {
    console.log("Información del prestamo:", data);
    this._globalService.Get("fechas-pagos/plan/" + data.planPago.id).subscribe({
      next: (response: any) => {
        console.log("Plan de pago:", response);
        this.elements = response;
        //Agregar columna numero correlativo
        this.elements.forEach((plan: any) => {
          plan.numero = this.elements.indexOf(plan) + 1;
        });
      },
      error: (error: any) => {
        console.error("Error al obtener el plan de pago:", error);
      },
    });
  }
}
