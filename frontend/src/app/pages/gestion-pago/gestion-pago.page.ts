import {
  Component,
  inject,
  OnInit,
  ViewChild,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { NgxPrintService, PrintOptions } from "ngx-print";
import { catchError, firstValueFrom, Subscription, tap } from "rxjs";
import { UploaderComponent } from "src/app/shared/components/uploader/uploader.component";
import { FechasPagos } from "src/app/shared/interfaces/fecha-pago";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { PreventAbuseService } from "src/app/shared/services/prevent-abuse.service";
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
  existContrato = false;
  isPrint = false;
  isPagado = false;

  isToastOpen = false;
  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  textLoader: string = "primary";

  idPrestamoUrl: string = "primary";

  mora: number = 0;
  montoPagado: number = 0;
  adeudoCuota: number = 0;
  adeudoMora: number = 0;
  adeudoTotal: number = 0;
  daysLate: number = 0;

  formModels: FormModels;
  pagoForm: FormGroup;

  uploader!: FileUploader;

  private _globalService = inject(GlobalService);
  private _route = inject(ActivatedRoute);
  private _printService = inject(NgxPrintService);
  private _loaderService = inject(LoaderService);
  private _preventAbuseService = inject(PreventAbuseService);

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.pagoForm = this.formModels.pagoForm();
  }

  ngOnInit(): void {}

  printSection() {
    this.isPrint = true;
    this.textLoader = "Imprimiendo...";
    this._loaderService.show();
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: "print-fechas-pagos",
      printTitle:
        "Fechas de Pago" + " - Prestamo(" + this.prestamoSeleccionado.id + ")",

      // Add any other print options as needed
    });
    this._printService.styleSheetFile = "assets/css/print.css";

    //eliminar elemento         key: "actions", del objeto columnsData
    const indexActions = this.columnsData.findIndex(
      (column) => column.key === "actions"
    );
    if (indexActions !== -1) {
      this.columnsData.splice(indexActions, 1);
    }

    //esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this._printService.print(customPrintOptions);

      //Volver a colocar la columna actions
      this.columnsData.splice(indexActions, 0, {
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
      });

      this.isPrint = false;
      this._loaderService.hide();
    }, 1000);
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  verifyExistContract() {
    firstValueFrom(
      this._globalService.Get(
        `contratos-pagos/verify/${this.prestamoSeleccionado.id}`
      )
    )
      .then((data: any) => {
        const { exist } = data;

        //console.log("Contrato existente", data);
        if (exist) {
          this.existContrato = true;
          this.getFechasPago(this.prestamoSeleccionado);
        } else {
          this.existContrato = false;
        }
      })
      .catch((error: any) => {
        console.error("Error al verificar si existe el contrato", error);
      });
  }

  ionViewDidEnter() {
    this.getPrestamo();
    this.buildColumns();
  }

  async save(data: any) {
    if (await this._preventAbuseService.registerClick()) {
      // return;
      if (data.monto > this.adeudoTotal) {
        this.toastColor = "danger";
        this.toastMessage = "El monto no puede ser mayor al adeudo total";
        this.isToastOpen = true;
        return;
      }
      if (data.estado === true) {
        //console.log("Modo Edicion");
      } else {
        //console.log("Modo Creación");
      }

      if (data.fechaPago === "" || data.fechaPago === null) {
        this.toastColor = "danger";
        this.toastMessage = "Debe seleccionar una fecha de pago";
        this.isToastOpen = true;
        return;
      }

      if (data.monto === null || data.monto <= 0) {
        this.toastColor = "danger";
        this.toastMessage = "Debe ingresar un monto válido";
        this.isToastOpen = true;
        return;
      }

      //console.log("Formulario de Registro de Pago: ", data);

      const file = this.uploaderComponent?.uploader?.queue[0]?._file;

      //console.log("Archivo subido: ", file);

      data.idPrestamo = this.prestamoSeleccionado.id;
      data.mora = this.mora;

      firstValueFrom(
        this._globalService.PostWithFile("pagos/saveFile", data, file)
      )
        .then((response) => {
          //console.log("Respuesta del Servidor: ", response);
          this.getFechasPago(this.prestamoSeleccionado);
          this.uploaderComponent?.uploader?.clearQueue();

          // TODO: Mostrar mensaje de éxito
          this.toastColor = "success";
          this.toastMessage = "Pago guardado correctamente";
          this.isToastOpen = true;
        })
        .catch((error) => {
          console.error("Error en el Servidor: ", error);
          // TODO: Mostrar mensaje de error
          this.toastColor = "danger";
          this.toastMessage = "Error al guardar el pago";
          this.isToastOpen = true;
        });
    }
  }

  changeDate(): void {
    const date = this.pagoForm.get("fechaPago")?.value;
    let diffDays = this.getDiffDays(this.pagoSeleccionado.fechaPago, date);
    let mora = 0;
    this.daysLate = 0;

    if (diffDays < 0) {
      this.daysLate = Math.abs(diffDays);
    }

    let oldDaysLate = 0;
    if (this.pagoSeleccionado?.pagos) {
      const fechasPagos = this.pagoSeleccionado.pagos.reduce(
        (acc: any, pago: any) => {
          acc.push(pago.fechaPago);
          return acc;
        },
        []
      );

      fechasPagos.forEach((fecha: any) => {
        const diffDaysOld = this.getDiffDays(
          this.pagoSeleccionado.fechaPago,
          fecha
        );
        if (diffDaysOld < 0) {
          oldDaysLate += Math.abs(diffDaysOld);
        }
      });

      //console.log("Fechas de pagos: ", fechasPagos);
    }
    this.daysLate += oldDaysLate;
    //console.log("Días de atraso: ", this.daysLate);
    mora = this.calculateMora(this.pagoSeleccionado.monto, this.daysLate);
    this.mora = mora;
    this.calculateTotales();
    this.hasMora = mora > 0;
    this.pagoForm.get("mora")?.setValue(mora);
  }

  calculateMora(monto: number, daysLate: number): number {
    const moraForDay = Number(((PERCENTAGE / 30) * monto).toFixed(2));
    //console.log("Mora por dia: ", moraForDay);
    return Number((daysLate * moraForDay).toFixed(2));
  }

  private getDiffDays(fechaPagar: string, fechaRealizaPago: string): number {
    const currentDate = new Date(fechaRealizaPago);
    const fechaPago = new Date(fechaPagar);

    return Math.ceil(
      (fechaPago.getTime() - currentDate.getTime()) / MILLISECONDS_PER_DAY
    );
  }

  async getPrestamo() {
    try {
      const params = await firstValueFrom(this._route.paramMap);
      const id = params.get("id");

      if (!id) {
        this.resetPrestamoState();
        return;
      }

      const idDecrypted = await this.getDecryptedId(id);
      if (!idDecrypted) return;

      const prestamo = await this.fetchPrestamo(idDecrypted);
      this.updatePrestamoState(prestamo);
    } catch (error) {
      console.error("Error fetching prestamo:", error);
      // Consider adding user-friendly error handling here
    }
  }

  private getDecryptedId(id: string): Promise<number | any> {
    return firstValueFrom(
      this._globalService.GetIdDecrypted("decrypted-id", id).pipe(
        catchError((error: any) => {
          console.error("Error decrypting ID:", error);
          return error;
        })
      )
    );
  }

  private fetchPrestamo(idDecrypted: number): Promise<any> {
    return firstValueFrom(
      this._globalService.GetId("prestamos", idDecrypted).pipe(
        tap((prestamo: any) => {
          prestamo = this._globalService.parseObjectDates(prestamo);
          //console.log("Prestamo:", prestamo);
          //console.log("Plan de Pago:", prestamo.planPago);
        }),
        catchError((error) => {
          console.error("Error fetching prestamo:", error);
          throw error;
        })
      )
    );
  }

  private updatePrestamoState(prestamo: any): void {
    this.prestamoSeleccionado = prestamo;
    this.clienteSeleccionado = prestamo.cliente;
    this.avalSeleccionado = prestamo.aval;
    this.hasAval = !!prestamo.idAval;
    this.verifyExistContract();
  }

  private resetPrestamoState(): void {
    this.prestamoSeleccionado = null;
  }

  private buildColumns(): void {
    this.columnsData = [
      { key: "numero", alias: "No. Cuota" },
      { key: "id", alias: "Código Cuota" },
      { key: "fechaPago", alias: "Fecha de Pago", type: "date" },
      { key: "monto", alias: "Monto Cuota", type: "currency" },
      { key: "mora", alias: "Monto Mora", type: "currency" },
      {
        key: "pagos",
        alias: "Pagos Realizados",
        type: "array",
        propsVisibles: ["fechaPago", "monto"],
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Pagado", "No Pagado"],
      },
      {
        key: "verificacion",
        alias: "Pago Total",
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
    this.resetPaymentValues();
    // //console.log("Elemento seleccionado:", data);
    this.pagoSeleccionado = data;

    this.calculatePaymentDetails(data);

    this.hasMora = data.mora > 0;
    this.mora = data.mora;
    this.getMora(data.id);
    this.daysLate = data.daysLate;

    this.pagoForm.patchValue({
      ...data,
      fechaPago: this.getFormattedPaymentDate(),
    });
    this.scrollToElement("pago-form");
  }

  onDeleteButtonClicked(data: any) {
    //console.log("Elemento eliminado:", data);
    firstValueFrom(this._globalService.Delete("pagos", data.id))
      .then(async () => {
        this.toastColor = "success";
        this.toastMessage = "Pago eliminado exitosamente.";
        this.isToastOpen = true;

        const prestamo = await this.fetchPrestamo(this.prestamoSeleccionado.id);
        this.updatePrestamoState(prestamo);
      })
      .catch((error: any) => {
        this.toastColor = "danger";
        this.toastMessage = "Error al eliminar el pago.";
        this.isToastOpen = true;
        console.error("Error al eliminar el pago:", error);
      });
  }

  private resetPaymentValues(): void {
    this.mora = 0;
    this.adeudoCuota = 0;
    this.adeudoMora = 0;
    this.adeudoTotal = 0;
    this.montoPagado = 0;
    this.daysLate = 0;
  }

  private calculatePaymentDetails(data: any): void {
    this.adeudoCuota = data.monto;
    if (data?.pagos?.length > 0) {
      const total = data.pagos.reduce(
        (acc: number, current: any) => acc + current.monto,
        0
      );
      this.montoPagado = total;
      this.adeudoCuota = total >= data.monto ? 0 : data.monto - total;
      // //console.log("Total pagado:", total);
    }
  }

  private getFormattedPaymentDate(): string {
    return this._globalService.formatDateForInput(new Date().toISOString());
  }

  getMora(id: number): void {
    firstValueFrom(this._globalService.GetId("moras/fecha-pago", id))
      .then((response: any) => {
        //console.log("Mora:", response);
        const mora = this.calculateTotalMora(response);
        if (mora > 0) {
          this.mora = this.calculateTotalMora(response);
        }
        this.calculateTotales();
      })
      .catch((error: any) => console.error("Error al obtener la mora:", error));
  }

  private calculateTotalMora(moraData: any[]): number {
    return moraData.reduce(
      (acc: number, current: any) => acc + current.mora,
      0
    );
  }

  calculateTotales(): void {
    const diferencia = Math.abs(
      this.montoPagado - (this.mora + this.pagoSeleccionado.monto)
    );
    this.adeudoMora =
      this.montoPagado > this.pagoSeleccionado.monto ? diferencia : this.mora;
    this.adeudoTotal = diferencia;
    // //console.log("Diferencia:", diferencia);
    this.pagoForm.get("monto")?.setValue(this.adeudoTotal.toFixed(2));
  }

  onUploaderChange(uploader: any): void {
    //console.log(uploader);
  }

  private getFechasPago(data: any): void {
    //console.log("Información del prestamo:", data);
    firstValueFrom(
      this._globalService.Get(`fechas-pagos/plan/${data.planPago.id}`)
    )
      .then((response: any) => {
        //console.log("Plan de pago:", response);
        this.elements = this.processFechasPago(response);
        const lastValue = this.elements.filter((cuota) => cuota.estado).length;
        this.selectPago(lastValue);
      })
      .catch((error: any) => {
        console.error("Error al obtener el plan de pago:", error);
      });
  }

  private processFechasPago(fechasPago: any[]): any[] {
    return fechasPago.map((cuota: any, index: number) => {
      // si es ultima cuota retorna con estado pagado
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

      if (cuota?.moras) {
        cuota.mora = cuota.moras.mora;
        //console.log("Mora en DB:", cuota.mora);
      }

      return cuota;
    });
  }

  private selectPago(index: number): void {
    //Verificar antes si el index es mayor que la cantidad de cuotas
    if (index >= 0 && index < this.elements.length) {
      const pagoSelect = this.elements[index];
      this.onselectButtonClicked(pagoSelect);
      this.isPagado = false;
    } else {
      this.isPagado = true;
    }
  }
}
