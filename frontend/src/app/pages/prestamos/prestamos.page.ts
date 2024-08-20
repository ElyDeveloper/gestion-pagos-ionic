import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { Clientes } from "src/app/shared/interfaces/cliente";
import { Cuotas } from "src/app/shared/interfaces/cuotas";
import { Prestamos } from "src/app/shared/interfaces/prestamo";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { ActionButtonAdd } from "src/app/shared/utils/enums";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-prestamos",
  templateUrl: "./prestamos.page.html",
  styleUrls: ["./prestamos.page.scss"],
})
export class PrestamosPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  elements: Prestamos[] = [];
  element: Prestamos = {
    monto: 0,
    tasaInteres: 0,
    totalMonto: 0,
    fechaSolicitud: "",
    fechaAprobacion: "",
    estado: true,
    idCliente: 0,
    idProducto: 0,
    idPeriodoCobro: 0,
    idEstadoAprobacion: 0,
    idPlan: 0,
    idMoneda: 0,
  };

  currentPage = 1;
  currentPageSize = 10;
  totalPages = 0;

  columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)

  formAdd: FormGroup;
  formModels: FormModels;

  isModalOpen = false;
  isToastOpen = false;
  isEdit = false;

  textLoader: string = "Cargando...";
  toastMessage: string = "cliente guardado correctamente";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;
  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);
  private _router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.prestamoForm();
    this.formSelected = this.formAdd;
    console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {
    this.getCountElements();
    this.buildColumns();
  }

  //TODO: ESPECIFICO
  openTipoPrestamoModal() {}

  //TODO: ESPECIFICO
  openClienteModal() {}

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  cleanForm() {
    this.formAdd.reset();
    this.formAdd = this.formModels.prestamoForm();
  }

  buildColumns() {
    this.columnsData = [
      {
        key: "cliente.nombres",
        alias: "Nombre Completo",
        type: "concat",
        combineWith: "cliente.apellidos",
        combineFormat: (nombre, apellido) => `${nombre} ${apellido}`,
      },
      {
        key: "monto",
        alias: "Monto",
        type: "currency",
      },
      {
        key: "tasaInteres",
        alias: "Tasa de Interés",
        type: "percentage",
      },
      {
        key: "totalMonto",
        alias: "Total Monto",
        type: "currency",
      },
      {
        key: "fechaSolicitud",
        alias: "Fecha de Solicitud",
        type: "date",
      },
      {
        key: "fechaAprobacion",
        alias: "Fecha de Aprobación",
        type: "date",
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
      },
      {
        key: "producto.nombre",
        alias: "Producto",
      },
      {
        key: "periodo.nombre",
        alias: "Período de Cobro",
      },
      {
        key: "estadoAprobacion.nombre",
        alias: "Estado de Aprobación",
      },
      {
        key: "planPago.cuotasPagar",
        alias: "Plan de Pago",
        type: "add",
        texto: "Cuotas",
        addText: (cuotasPagar, texto) => `${cuotasPagar} ${texto}`,
      },
      {
        key: "moneda.nombreMoneda",
        alias: "Moneda",
      },
      {
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Editar",
            action: "edit",
            icon: "create",
            color: "primary",
            rolesAuthorized: [1,2]
          },
          {
            alias: "Información",
            action: "info",
            icon: "information",
            color: "tertiary",
          },
          {
            alias: "Eliminar",
            action: "delete",
            icon: "close",
            color: "danger",
            rolesAuthorized: [1]
          },
        ],
      },
    ];
  }

  getCellValue(row: any, column: Column): any {
    const primaryValue = this.getNestedValue(row, column.key);

    if (column.combineWith) {
      const secondaryValue = this.getNestedValue(row, column.combineWith);
      if (column.combineFormat) {
        return column.combineFormat(primaryValue, secondaryValue);
      }
      return `${this.formatValue(primaryValue)} ${this.formatValue(
        secondaryValue
      )}`;
    }

    return this.formatValue(primaryValue);
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split(".").reduce((o, k) => (o || {})[k], obj);
  }

  private formatValue(value: any): string {
    if (value && typeof value === "object") {
      return value.nombre || JSON.stringify(value);
    }
    return value !== undefined && value !== null ? value.toString() : "";
  }

  // Este método ya no es necesario, pero lo mantenemos por compatibilidad
  getObjectValue(row: any, key: string): any {
    const value = this.getNestedValue(row, key);
    return this.formatValue(value);
  }

  getDateValue(row: any, key: string): any {
    const element = key.split(".").reduce((o, k) => (o || {})[k], row);

    if (element) {
      return new Date(element);
    }
    return "";
  }

  private setModalState(isEdit: boolean, modalTemplate: any, formData?: any) {
    this.isEdit = isEdit;

    if (formData) {
      formData.fechaInicial = this.formatDateForInput(formData.fechaInicial);
      if (formData.fechaFinal) {
        formData.fechaFinal = this.formatDateForInput(formData.fechaFinal);
      }
    }
    console.log("Form Data:", formData);
    this.element = formData;
    if (isEdit && formData) {
      this.formAdd.patchValue(formData);
      // TODO: ESPECIFICO
      const fullName = `${formData.cliente.nombres.split(" ")[0]} ${
        formData.cliente.apellidos.split(" ")[0]
      }`;
      this.formAdd.get("idCliente")?.setValue(fullName);
      this.formAdd.get("idTipoPrestamo")?.setValue(formData.tipoPrestamo.id);
    } else if (!isEdit) {
      this.cleanForm();
    }

    this.modalSelected = modalTemplate;
    this.formSelected = this.formAdd;
    this.isModalOpen = true;
  }

  formatDateForInput(dateString: string): string {
    return dateString.split("T")[0];
  }

  onAddButtonClicked() {
    this._router.navigate(["/layout/gestion-prestamo"], {
      
    });
    // this._router.navigate(["/layout"]);

  }

  onEditButtonClicked(data: any) {
    this.setModalState(true, this.modalAdd, data);
  }

  onInfoButtonClicked(data: any) {
    // console.log("Información del cliente:", data);
    this.element = data;
    this.modalSelected = this.modalViewInfo;
    this.isModalOpen = true;
  }

  onDeleteButtonClicked(data: any) {
    console.log("Eliminar cliente Obtenido:", data);
    this.textLoader = "Eliminando cliente";
    this.loaderComponent.show();
    this._globalService.Delete("clientes", data.id).subscribe({
      next: (response: any) => {
        console.log("cliente eliminado:", response);
        this.getCountElements();
        this.loaderComponent.hide();
        this.toastMessage = "cliente eliminado correctamente";
        this.setOpenedToast(true);
      },
      error: (error: any) => {
        console.error("Error al eliminar el cliente:", error);
        this.loaderComponent.hide();
        this.toastMessage = "Error al eliminar el cliente";
        this.setOpenedToast(true);
      },
    });
  }

  handleUserOperation(operation: "edit" | "create", data: any): void {
    const { operationText, apiCall } = this.getOperationConfig(operation, data);

    this.textLoader = `${operationText} cliente`;
    this.loaderComponent.show();

    this.updateDataFromElement(data);

    console.log("Datos del cliente:", data);

    apiCall.subscribe({
      next: (response: any) =>
        this.handleOperationSuccess(response, operationText),
      error: (error: any) => this.handleOperationError(error, operationText),
    });
  }

  private getOperationConfig(
    operation: "edit" | "create",
    data: any
  ): { operationText: string; apiCall: Observable<any> } {
    switch (operation) {
      case "edit":
        return {
          operationText: "Editando",
          apiCall: this._globalService.PutId("prestamos", data.id, data),
        };
      case "create":
        const { id, ...dataWithoutId } = data;
        return {
          operationText: "Guardando",
          apiCall: this._globalService.Post("prestamos", dataWithoutId),
        };
      default:
        throw new Error(`Operación no soportada: ${operation}`);
    }
  }

  //INFO METODO ESPECIFICO
  private updateDataFromElement(data: any): void {
    Object.assign(data, {
      idCliente: this.element.idCliente,
      idProducto: this.element.idProducto,
      idPeriodoCobro: this.element.idPeriodoCobro,
      idEstadoAprobacion: this.element.idEstadoAprobacion,
      idPlan: this.element.idPlan,
      idMoneda: this.element.idMoneda,
    });
  }

  private handleOperationSuccess(response: any, operationText: string): void {
    console.log(`cliente ${operationText.toLowerCase()}:`, response);
    this.isModalOpen = false;
    this.loaderComponent.hide();
    this.toastMessage = `cliente ${operationText.toLowerCase()} correctamente`;
    this.setOpenedToast(true);
    this.cleanForm();
    this.getCountElements();
  }

  private handleOperationError(error: any, operationText: string): void {
    console.error(`Error al ${operationText.toLowerCase()} el cliente:`, error);
    this.loaderComponent.hide();
    this.toastMessage = `Error al ${operationText.toLowerCase()} el cliente`;
    this.setOpenedToast(true);
  }

  async handleSave(data: any) {
    if (this.isEdit) {
      this.handleUserOperation("edit", data);
    } else if (!this.isEdit) {
      delete data.id;
      this.handleUserOperation("create", data);
    }
  }

  onPageChange(event: any) {
    console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    this.getElementsPag();
  }

  onSearchData(event: any) {
    console.log("Evento de búsqueda:", event);
    if (event === "") {
      this.getCountElements();
    } else {
      this._globalService.Get(`prestamos/search?query=${event}`).subscribe({
        next: (response: any) => {
          this.elements = response;
          console.log("Elementos obtenidos:", response);
        },
        error: (error) => {
          console.error("Error al obtener los elementos:", error);
        },
      });
    }
  }

  getElementsPag() {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    this._globalService
      .Get(`prestamos/paginated?skip=${skip}&limit=${limit}`)
      .subscribe({
        next: (response: any) => {
          this.elements = response;
          console.log("Elementos obtenidos:", response);
        },
        error: (error) => {
          console.error("Error al obtener los elementos:", error);
        },
      });
  }

  getCountElements() {
    this._globalService.Get("prestamos/count").subscribe({
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
}
