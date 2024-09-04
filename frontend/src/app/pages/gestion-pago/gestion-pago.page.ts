import { Component, inject, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { Subscription } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { UploaderComponent } from "src/app/shared/components/uploader/uploader.component";
import { FechasPagos } from "src/app/shared/interfaces/fecha-pago";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { FormModels } from "src/app/shared/utils/forms-models";
import { environment } from "src/environments/environment";

const PERCENTAGE = environment.percentage;
const MILLISECONDS_PER_DAY = 1000 * 3600 * 24;

@Component({
  selector: "app-gestion-pago",
  templateUrl: "./gestion-pago.page.html",
  styleUrls: ["./gestion-pago.page.scss"],
})
export class GestionPagoPage implements OnInit {
  @ViewChild(LoaderComponent) private loaderComponent!: LoaderComponent;

  @ViewChild(UploaderComponent) uploaderComponent:
    | UploaderComponent
    | undefined;

  elements: FechasPagos[] = [];
  columnsData: Column[] = [];

  prestamoSeleccionado: any = {};
  clienteSeleccionado: any = {};
  avalSeleccionado: any = {};
  pagoSeleccionado: any = {};

  hasAval = false;
  hasMora = false;
  isEditar = false;
  existContrato = false;

  mora = 0;
  daysLate = 0;

  private suscriptions: Subscription[] = [];

  formModels: FormModels;
  pagoForm: FormGroup;

  uploader!: FileUploader;

  private globalService = inject(GlobalService);
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.pagoForm = this.formModels.pagoForm();
  }

  ngOnInit(): void {}

  verifyExistContract() {
    this.suscriptions.push(
      this.globalService
        .Get(`contratos-pagos/verify/${this.prestamoSeleccionado.id}`)
        .subscribe({
          next: (data: any) => {
            const { exist } = data;

            console.log("Contrato existente", data);
            if (exist) {
              this.existContrato = true;
              this.getFechasPago(this.prestamoSeleccionado);
            } else {
              this.existContrato = false;
            }
          },
          error: (error: any) => {
            console.error("Error al verificar si existe el contrato", error);
          },
        })
    );
  }

  ionViewDidEnter() {
    this.getIdByUrl();
    this.buildColumns();
  }
  ionViewDidLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
  }

  save(data: any): void {
    if (data.estado === true) {
      console.log("Modo Edicion");
      this.isEditar = true;
    } else {
      console.log("Modo Creación");
      this.isEditar = false;
    }

    console.log("Formulario de Registro de Pago: ", data);

    const file = this.uploaderComponent?.uploader?.queue[0]?._file;

    console.log("Archivo subido: ", file);

    data.idPrestamo = this.prestamoSeleccionado.id;

    if (!this.isEditar) {
      this.globalService.PostWithFile("pagos/saveFile", data, file).subscribe({
        next: (response) => {
          console.log("Respuesta del Servidor: ", response);
          this.getFechasPago(this.prestamoSeleccionado);
          // TODO: Mostrar mensaje de éxito
        },
        error: (error) => {
          console.error("Error en el Servidor: ", error);
          // TODO: Mostrar mensaje de error
        },
      });
    }
    {
      this.globalService.PutWithFile("pagos/updateFile", data, file).subscribe({
        next: (response) => {
          console.log("Respuesta del Servidor: ", response);
          this.getFechasPago(this.prestamoSeleccionado);
          // TODO: Mostrar mensaje de éxito
        },
        error: (error) => {
          console.error("Error en el Servidor: ", error);
          // TODO: Mostrar mensaje de error
        },
      });
    }
  }

  changeDate(): void {
    const date = this.pagoForm.get("fechaPago")?.value;
    const diffDays = this.getDiffDays(this.pagoSeleccionado.fechaPago, date);
    let mora = 0;
    if (diffDays < 0) {
      this.daysLate = Math.abs(diffDays);
      mora = this.calculateMora(this.pagoSeleccionado.monto, this.daysLate);
    }

    this.hasMora = mora > 0;
    this.pagoForm.get("mora")?.setValue(mora);
  }

  calculateMora(monto: number, daysLate: number): number {
    const moraForDay = Number(((PERCENTAGE / 30) * monto).toFixed(2));
    return Number((daysLate * moraForDay).toFixed(2));
  }

  private getDiffDays(fechaPagar: string, fechaRealizaPago: string): number {
    const currentDate = new Date(fechaRealizaPago);
    const fechaPago = new Date(fechaPagar);

    return Math.ceil(
      (fechaPago.getTime() - currentDate.getTime()) / MILLISECONDS_PER_DAY
    );
  }

  isSuccessState(): boolean {
    return !!this.clienteSeleccionado?.id && this.pagoForm.valid;
  }

  isWarningState(): boolean {
    return !this.clienteSeleccionado?.id || !this.pagoForm.valid;
  }

  private getIdByUrl(): void {
    this.suscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.fetchPrestamo(id);
        } else {
          this.prestamoSeleccionado = null;
        }
      })
    );
  }

  private fetchPrestamo(id: string): void {
    this.globalService.GetByIdEncrypted("prestamos", id).subscribe({
      next: (prestamo: any) => {
        if (prestamo) {
          this.processPrestamo(prestamo);
        }
      },
      error: (error) => console.error(error),
    });
  }

  private processPrestamo(prestamo: any): void {
    prestamo = this.globalService.parseObjectDates(prestamo);
    console.log("Prestamo: ", prestamo);
    this.prestamoSeleccionado = prestamo;
    this.clienteSeleccionado = prestamo.cliente;
    this.avalSeleccionado = prestamo.aval;
    this.hasAval = !!prestamo.idAval;

    this.verifyExistContract();
  }

  private buildColumns(): void {
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

  onselectButtonClicked(data: any): void {
    console.log("Elemento seleccionado:", data);
    this.pagoSeleccionado = data;

    const fechaPagar = new Date();
    fechaPagar.setHours(0, 0, 0, 0);
    const fechaPago = this.globalService.formatDateForInput(
      fechaPagar.toISOString()
    );

    this.hasMora = data.mora > 0;
    this.daysLate = data.daysLate;

    this.pagoForm.patchValue({ ...data, fechaPago });

    this.scrollToElement("pago-form");
  }

  onUploaderChange(uploader: any): void {
    console.log(uploader);
  }

  private getFechasPago(data: any): void {
    console.log("Información del prestamo:", data);
    this.globalService.Get(`fechas-pagos/plan/${data.planPago.id}`).subscribe({
      next: (response: any) => {
        console.log("Plan de pago:", response);
        this.elements = this.processFechasPago(response);
        const lastValue = this.elements.filter((cuota) => cuota.estado).length;
        this.selectPago(lastValue);
      },
      error: (error: any) => {
        console.error("Error al obtener el plan de pago:", error);
      },
    });
  }

  private processFechasPago(fechasPago: any[]): any[] {
    return fechasPago.map((cuota: any, index: number) => {
      cuota.numero = index + 1;
      cuota.idFechaPago = cuota.id;

      if (!cuota.estado) {
        const fechaPagar = new Date();
        fechaPagar.setHours(0, 0, 0, 0);
        const diffDays = this.getDiffDays(
          cuota.fechaPago,
          fechaPagar.toISOString()
        );

        if (diffDays < 0) {
          cuota.verificacion = 1;
          cuota.daysLate = Math.abs(diffDays);
          cuota.mora = this.calculateMora(cuota.monto, cuota.daysLate);
        } else {
          cuota.verificacion = 0;
          cuota.daysLate = 0;
          cuota.mora = 0;
        }
      } else {
        cuota.verificacion = 2;
        cuota.daysLate = 0;
        cuota.mora = 0;
      }

      return cuota;
    });
  }

  private selectPago(index: number): void {
    const pagoSelect = this.elements[index];
    this.onselectButtonClicked(pagoSelect);
  }
}
