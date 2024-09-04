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

  @Output() changeView: EventEmitter<void> = new EventEmitter();

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
  isPrint = false;

  isToastOpen = false;
  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  textLoader: string = "primary";

  idPrestamoUrl: string = "primary";

  fileUrl: string = "";

  mora: number = 0;
  montoPagado: number = 0;
  adeudoCuota: number = 0;
  adeudoMora: number = 0;
  adeudoTotal: number = 0;
  daysLate: number = 0;

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

  printSection() {
    this.textLoader = "Importando...";
    this.isPrint = true;
    this.changeViewState();
    this.loaderComponent.show();
    //Esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this.loaderComponent.hide();

      var contentToPrint = document.getElementById(
        "contentToPrint"
      ) as HTMLElement;

      //Verificar si hay contenido para imprimir
      if (!contentToPrint) {
        this.isPrint = false;
        this.changeViewState();
        return;
      }

      // Ocultar la URL del documento durante la impresión
      const style = document.createElement("style");
      style.innerHTML = `
      @page {
        size: A4 portrait;
        margin: 0;
      }
  
      @media print {
        @page { margin-bottom: 0; margin-top: 0; }
        body::after { content: none !important;
      }
    `;

      // contentToPrint.innerHTML = contentToPrint.innerHTML;
      contentToPrint.appendChild(style);

      // var contentToPrint = document.getElementById('contentToPrint').innerHTML;
      // document.body.innerHTML = contentToPrint.innerHTML;

      //Esperar a que se cargue la imagen
      setTimeout(() => {
        // Imprimir el contenido
        window.print();
        //Eliminar los estilos
        contentToPrint.removeChild(style);
        this.isPrint = false;
        console.log("Valor isPrint desde RangePicker: ", this.isPrint);
        this.changeViewState();
        console.log("Se ha restablecido el componente...");
        // window.location.reload();
      }, 3000);
    }, 1000);
  }

  changeViewState() {
    this.changeView.emit();
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

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

  getFileIfExist(idPago: number) {
    this.globalService.GetId("documentos/by-fecha-pago", idPago).subscribe({
      next: (response: any) => {
        console.log("Respuesta del Servidor: ", response);
        if (response?.urlDocumento) {
          this.fileUrl = response.urlDocumento;
        }
      },
      error: (error) => {
        console.error("Error en el Servidor: ", error);
      },
    });
  }

  save(data: any): void {
    if (data.monto > this.adeudoTotal) {
      this.toastColor = "danger";
      this.toastMessage = "El monto no puede ser mayor al adeudo total";
      this.isToastOpen = true;
      return;
    }
    if (data.estado === true) {
      console.log("Modo Edicion");
      this.isEditar = true;
    } else {
      console.log("Modo Creación");
      this.isEditar = false;
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

    console.log("Formulario de Registro de Pago: ", data);

    const file = this.uploaderComponent?.uploader?.queue[0]?._file;

    console.log("Archivo subido: ", file);

    data.idPrestamo = this.prestamoSeleccionado.id;
    data.mora = this.mora;

    if (!this.isEditar) {
      this.globalService.PostWithFile("pagos/saveFile", data, file).subscribe({
        next: (response) => {
          console.log("Respuesta del Servidor: ", response);
          this.getFechasPago(this.prestamoSeleccionado);
          this.uploaderComponent?.uploader?.clearQueue();

          // TODO: Mostrar mensaje de éxito
          this.toastColor = "success";
          this.toastMessage = "Pago guardado correctamente";
          this.isToastOpen = true;
        },
        error: (error) => {
          console.error("Error en el Servidor: ", error);
          // TODO: Mostrar mensaje de error
          this.toastColor = "danger";
          this.toastMessage = "Error al guardar el pago";
          this.isToastOpen = true;
        },
      });
    }
    {
      this.globalService.PutWithFile("pagos/updateFile", data, file).subscribe({
        next: (response) => {
          console.log("Respuesta del Servidor: ", response);
          this.getFechasPago(this.prestamoSeleccionado);
          this.uploaderComponent?.uploader?.clearQueue();

          // TODO: Mostrar mensaje de éxito
          this.toastColor = "success";
          this.toastMessage = "Pago modificado correctamente";
          this.isToastOpen = true;
        },
        error: (error) => {
          console.error("Error en el Servidor: ", error);

          // TODO: Mostrar mensaje de error
          this.toastColor = "danger";
          this.toastMessage = "Error al modificar el pago";
          this.isToastOpen = true;
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
      this.mora = mora;
      this.calculateTotales();
    }

    this.hasMora = mora > 0;
    this.pagoForm.get("mora")?.setValue(mora);
  }

  calculateMora(monto: number, daysLate: number): number {
    const moraForDay = Number(((PERCENTAGE / 30) * monto).toFixed(2));
    console.log("Mora por dia: ", moraForDay);
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
        this.idPrestamoUrl = id || "";
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
        key: "pagos",
        alias: "Pagos Realizados",
        type: "array",
        propsVisibles: ["fechaPago", "monto"],
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
          // {
          //   alias: "Pagos - ",
          //   action: "info",
          //   icon: "information",
          //   color: "primary",
          //   rolesAuthorized: [1, 2, 3],
          // },
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
    // console.log("Elemento seleccionado:", data);
    this.pagoSeleccionado = data;

    this.calculatePaymentDetails(data);
    this.getFileIfExist(data.id);

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
    console.log("Elemento eliminado:", data);
    this.globalService.Delete("pagos", data.id).subscribe({
      next: () => {
        this.toastColor = "success";
        this.toastMessage = "Pago eliminado exitosamente.";
        this.isToastOpen = true;
        this.fetchPrestamo(this.idPrestamoUrl);
      },
      error: (error: any) => {
        this.toastColor = "danger";
        this.toastMessage = "Error al eliminar el pago.";
        this.isToastOpen = true;
        console.error("Error al eliminar el pago:", error);
      },
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
      // console.log("Total pagado:", total);
    }
  }

  private getFormattedPaymentDate(): string {
    return this.globalService.formatDateForInput(new Date().toISOString());
  }

  getMora(id: number): void {
    this.globalService.GetId("moras/fecha-pago", id).subscribe({
      next: (response: any) => {
        // console.log("Mora:", response);
        this.mora = this.calculateTotalMora(response);
        this.calculateTotales();
      },
      error: (error: any) => console.error("Error al obtener la mora:", error),
    });
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
    // console.log("Diferencia:", diferencia);
    this.pagoForm.get("monto")?.setValue(this.adeudoTotal.toFixed(2));
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
