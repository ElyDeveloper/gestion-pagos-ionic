import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { FechasPagos } from "src/app/shared/interfaces/fecha-pago";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { FormModels } from "src/app/shared/utils/forms-models";
import { environment } from "src/environments/environment";

const PERCENTAGE = environment.percentage;

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
  hasMora: boolean = false;

  mora: number = 0;
  daysLate: number = 0;

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

  save(data: any) {
    console.log("Formulario de Registro de Pago: ", data);
  }

  changeDate() {
    const date = this.pagoForm.get("fechaPago")?.value;
    const diffDays = this.getDiffDays(this.pagoSeleccionado.fechaPago, date);
    let mora = 0;
    if (diffDays < 0) {
      this.daysLate = Math.abs(diffDays);
      mora = this.calculateMora(this.pagoSeleccionado.monto, this.daysLate);
    }

    if (mora > 0) {
      this.hasMora = true;
    } else {
      this.hasMora = false;
    }
    this.pagoForm.get("mora")?.setValue(mora);
  }

  calculateMora(monto: number, daysLate: number) {
    console.log('Monto:', monto);
    console.log('Días de atraso:', daysLate);
    const moraForDay = Number(((PERCENTAGE / 30) * monto).toFixed(2));
    return Number((daysLate * moraForDay).toFixed(2));
  }

  getDiffDays(fechaPagar: string, fechaRealizaPago: string) {
    const currentDate = new Date(fechaRealizaPago);
    const fechaPago = new Date(fechaPagar);

    return Math.ceil(
      (fechaPago.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    );
  }

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
      { key: "monto", alias: "Monto Cuota", type: "currency" },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Pagado", "No Pagado"],
      },
      {
        key: "verificacion",
        alias: "Pago",
        type: "options",
        options: ["Pendiente", "En Mora", "Al día"],
        colorOptions: ["warning", "danger", "success"],
      },
      {
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Seleccionar",
            action: "select",
            icon: "open",
            color: "primary",
            rolesAuthorized: [1, 2],
          },
        ],
      },
    ];
  }

  scrollToElement(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  onselectButtonClicked(data: any) {
    console.log("Elemento seleccionado:", data);
    this.pagoSeleccionado = data;

    let fechaPago: string = "N/A";
    if (data.fechaPago) {
      const fechaPagar = new Date();
      // console.log("fechaPagar Antes:", fechaPagar);
      //Setear hora a 00 de fechaPagar
      fechaPagar.setHours(0, 0, 0, 0);
      // console.log("fechaPagar Despues:", fechaPagar);
      fechaPago = this._globalService.formatDateForInput(
        fechaPagar.toISOString()
      );
    }

    if (data.mora > 0) {
      this.hasMora = true;
    } else {
      this.hasMora = false;
    }
    // this.mora = data.mora;
    this.daysLate = data.daysLate;

    this.pagoForm.patchValue(data);
    this.pagoForm.get("fechaPago")?.setValue(fechaPago);

    this.scrollToElement("pago-form");
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

        let counter = 0;
        let lastValue = 0;
        //Agregar columna numero correlativo
        this.elements.forEach((cuota: any) => {
          counter++;
          cuota.numero = this.elements.indexOf(cuota) + 1;
          cuota.idFechaPago = cuota.id;
          if (cuota.estado === false) {
            // console.log("Días de atraso:", diffDays);
            const fechaPagar = new Date();
            // console.log("fechaPagar Antes:", fechaPagar);
            //Setear hora a 00 de fechaPagar
            fechaPagar.setHours(0, 0, 0, 0);
            // console.log("fechaPagar Despues:", fechaPagar);

            const diffDays = this.getDiffDays(
              cuota.fechaPago,
              fechaPagar.toISOString()
            );

            if (diffDays < 0) {
              cuota.verificacion = 1;
              cuota.daysLate = Math.abs(diffDays);

              cuota.mora = this.calculateMora(cuota.monto, cuota.daysLate);
              console.log("Cuota Mora: ", cuota.mora);
            } else {
              cuota.verificacion = 0;
              cuota.daysLate = 0;
              cuota.mora = 0;
            }
          } else {
            cuota.verificacion = 2;
            cuota.daysLate = 0;
            cuota.mora = 0;
            lastValue = counter;
          }
        });
        this.selectPago(lastValue);
      },
      error: (error: any) => {
        console.error("Error al obtener el plan de pago:", error);
      },
    });
  }

  selectPago(index: number): void {
    const pagoSelect = this.elements[index];
    this.onselectButtonClicked(pagoSelect);
  }
}
