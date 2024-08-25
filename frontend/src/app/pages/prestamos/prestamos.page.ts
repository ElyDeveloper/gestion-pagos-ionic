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
import { Prestamos } from "src/app/shared/interfaces/prestamo";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
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
    idAval: 0,
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
  typeFormSelected: string = "formAdd";
  elementType: string = "prestamo";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;

  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);
  private _router = inject(Router);
  //TODO ESPECIFICO
  @ViewChild("modalAprobar", { static: true })
  modalAprobar!: TemplateRef<any>;

  @ViewChild("modalViewPlan", { static: true })
  modalViewPlan!: TemplateRef<any>;

  proyeccionesPlan: any[] = [];
  estadosAprobacion: any[] = [];
  columnsDataPlan: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)

  formAprobar: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.prestamoForm();
    this.formAprobar = this.formModels.checkForm();
    this.formSelected = this.formAdd;
    console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getEstadosAprobacion();
    this.getCountElements();
    this.buildColumns();
    this.buildColumnsPlan();
  }

  //TODO: ESPECIFICO
  getEstadosAprobacion() {
    // TODO: Implementar la llamada a la API para obtener los estados de aprobación
    Ejemplo: this._globalService
      .Get("estados-aprobacions")
      .subscribe((data: any) => {
        this.estadosAprobacion = data;
      });
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

  buildColumnsPlan() {
    this.columnsDataPlan = [
      { key: "numero", alias: "No. Cuota" },
      { key: "fechaPago", alias: "Fecha de Pago", type: "date" },
      { key: "cuota", alias: "Monto Cuota", type: "currency" },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Pagado", "Pendiente"],
      },
    ];
  }

  buildColumns() {
    this.columnsData = [
      {
        key: "cliente.nombres",
        alias: "Cliente",
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
        options: ["Activo", "Inactivo"],
      },
      {
        key: "aval.nombres",
        alias: "Aval",
        type: "concat",
        combineWith: "aval.apellidos",
        combineFormat: (nombre, apellido) => `${nombre} ${apellido}`,
      },
      {
        key: "producto.nombre",
        alias: "Producto",
      },
      {
        key: "periodoCobro.nombre",
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
            alias: "Cliente",
            action: "client",
            icon: "person",
            color: "primary",
            rolesAuthorized: [1, 2],
          },
          {
            alias: "Editar",
            action: "edit",
            icon: "create",
            color: "primary",
            rolesAuthorized: [1, 2],
          },
          {
            alias: "Plan de pago - ",
            action: "plan",
            icon: "list",
            color: "primary",
          },
          {
            alias: "Registrar pago -",
            action: "pay",
            icon: "card",
            color: "primary",
            rolesAuthorized: [1, 2],
          },
          {
            alias: "Contrato",
            action: "contract",
            icon: "document",
            color: "primary",
            rolesAuthorized: [1, 2],
          },
          {
            alias: "Información",
            action: "info",
            icon: "information",
            color: "tertiary",
          },
          {
            alias: "Aprobar",
            action: "check",
            icon: "checkmark",
            color: "success",
            rolesAuthorized: [1],
          },
          {
            alias: "Eliminar",
            action: "delete",
            icon: "close",
            color: "danger",
            rolesAuthorized: [1],
          },
        ],
      },
    ];
  }

  private setModalState(
    isEdit: boolean,
    modalTemplate: TemplateRef<any>,
    form: FormGroup,
    formData?: any
  ) {
    this.isEdit = isEdit;

    if (formData) {
      formData.planPago.fechaInicio = this.formatDateForInput(
        formData.planPago.fechaInicio
      );
      if (formData.fechaFinal) {
        formData.fechaFinal = this.formatDateForInput(formData.fechaFinal);
      }
    }
    console.log("Form Data:", formData);
    this.element = formData;

    form.get("fechaInicio")?.setValue(formData.planPago.fechaInicio);
    form.get("idEstadoAprobacion")?.setValue(formData.idEstadoAprobacion);

    // console.log("Modal Template: ", modalTemplate);
    // console.log("Form Select: ", form);

    this.modalSelected = modalTemplate;
    this.formSelected = form;
    this.typeFormSelected = "formAprobar";
    this.isModalOpen = true;
  }

  formatDateForInput(dateString: string): string {
    return dateString.split("T")[0];
  }

  onAddButtonClicked() {
    this._router.navigate(["/layout/gestion-prestamo"]);
    // this._router.navigate(["/layout"]);
  }

  onEditButtonClicked(data: any) {
    this._router.navigate(["/layout/gestion-prestamo/" + data.id]);
  }

  onContractButtonClicked(data: any) {
    console.log("Contrato del cliente:", data);
    this._router.navigate(["/gestion-contrato/" + data.id]);
  }

  onPagoButtonClicked(data: any) {
    console.log("Contrato del cliente:", data);
    this._router.navigate(["/layout/gestion-pago/" + data.id]);
  }

  onInfoButtonClicked(data: any) {
    // console.log("Información del cliente:", data);
    this.element = data;
    this.modalSelected = this.modalViewInfo;
    this.isModalOpen = true;
  }

  onPlanButtonClicked(data: any) {
    console.log("Información del prestamo:", data);
    this._globalService.Get("fechas-pagos/plan/" + data.planPago.id).subscribe({
      next: (response: any) => {
        console.log("Plan de pago:", response);
        this.proyeccionesPlan = response;
        //Agregar columna numero correlativo
        this.proyeccionesPlan.forEach((plan: any) => {
          plan.numero = this.proyeccionesPlan.indexOf(plan) + 1;
        });
        this.modalSelected = this.modalViewPlan;
        this.isModalOpen = true;
      },
      error: (error: any) => {
        console.error("Error al obtener el plan de pago:", error);
        this.loaderComponent.hide();
        this.toastMessage = "Error al obtener el plan de pago";
        this.setOpenedToast(true);
      },
    });
  }

  onCheckButtonClicked(data: any) {
    this.setModalState(false, this.modalAprobar, this.formAprobar, data);
  }

  onDeleteButtonClicked(data: any) {
    console.log("Eliminar cliente Obtenido:", data);
    this.textLoader = "Eliminando cliente";
    this.loaderComponent.show();
    this._globalService.Delete("prestamos", data.id).subscribe({
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
    const { operationText, apiCall } = this.getOperationConfigElement(
      operation,
      data
    );

    this.textLoader = `${operationText} ${this.elementType}`;
    this.loaderComponent.show();

    //TODO COMENTAR
    console.log(`Datos del ${this.elementType}: `, data);

    apiCall.subscribe({
      next: (response: any) =>
        this.handleOperationSuccess(response, operationText),
      error: (error: any) => this.handleOperationError(error, operationText),
    });
  }

  handleAprobar(operation: "edit" | "create", data: any): void {
    const { operationText, apiCall } = this.getOperationConfigCheck(
      operation,
      data
    );

    this.textLoader = `${operationText} ${this.elementType}`;
    // this.loaderComponent.show();

    //TODO COMENTAR
    // console.log(`Datos del ${this.elementType}: `, data);

    apiCall.subscribe({
      next: (response: any) =>
        this.handleOperationSuccess(response, operationText),
      error: (error: any) => this.handleOperationError(error, operationText),
    });
  }

  private getOperationConfigElement(
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

  private getOperationConfigCheck(
    operation: "edit" | "create",
    data: any
  ): { operationText: string; apiCall: Observable<any> } {
    const cuota =
      this.element.totalMonto / (this.element.planPago?.cuotasPagar || 1);
    const dataSave = {
      idPrestamo: this.element.id,
      planId: this.element.idPlan,
      estado: this.element.planPago?.estado || false,
      cuota,
      // fechaInicio: new Date(data.fechaInicio),
      fechaInicio: data.fechaInicio,
      periodoCobro: this.element.idPeriodoCobro,
      numeroCuotas: this.element.planPago?.cuotasPagar || 0,
      idEstadoAprobacion: data.idEstadoAprobacion || 0,
    };
    switch (operation) {
      case "edit":
        return {
          operationText: "Editando",
          apiCall: this._globalService.PutId(
            "check-prestamos/crear-fechas-pagos",
            data.id,
            dataSave
          ),
        };
      case "create":
        //TODO ONLY DEBUG
        console.log("Entro aquí: ", dataSave);
        return {
          operationText: "Guardando",
          apiCall: this._globalService.Post(
            "check-prestamos/crear-fechas-pagos",
            dataSave
          ),
        };
      default:
        throw new Error(`Operación no soportada: ${operation}`);
    }
  }

  private handleOperationSuccess(response: any, operationText: string): void {
    //TODO: COMENTAR
    console.log(`cliente ${operationText.toLowerCase()}:`, response);
    this.isModalOpen = false;
    this.loaderComponent.hide();
    this.toastMessage = `${
      this.elementType
    } ${operationText.toLowerCase()} correctamente`;
    this.setOpenedToast(true);
    this.cleanForm();
    this.getCountElements();
  }

  private handleOperationError(error: any, operationText: string): void {
    console.error(
      `Error al ${operationText.toLowerCase()} el ${this.elementType}:`,
      error
    );
    this.loaderComponent.hide();
    this.toastMessage = `Error al ${operationText.toLowerCase()} el ${
      this.elementType
    }`;
    this.setOpenedToast(true);
  }

  handleSave(data: any) {
    //TODO ONLY DEBUG
    // console.log(`Datos del formulario: `, data);
    switch (this.typeFormSelected) {
      case "formAdd":
        if (this.isEdit) {
          this.handleUserOperation("edit", data);
        } else if (!this.isEdit) {
          delete data.id;
          this.handleUserOperation("create", data);
        }
        break;
      case "formAprobar":
        this.handleAprobar("create", data);
        break;

      default:
        throw new Error(`Formulario no soportado: ${this.typeFormSelected}`);
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
