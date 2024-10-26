import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  catchError,
  firstValueFrom,
  Observable,
  Subscription,
  tap,
} from "rxjs";
import { Prestamos } from "src/app/shared/interfaces/prestamo";
import { Column } from "src/app/shared/interfaces/table";
import { Usuario } from "src/app/shared/interfaces/usuario";
import { AuthService } from "src/app/shared/services/auth.service";
import { GlobalService } from "src/app/shared/services/global.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-prestamos",
  templateUrl: "./prestamos.page.html",
  styleUrls: ["./prestamos.page.scss"],
})
export class PrestamosPage implements OnInit {
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
    idEstadoInterno: 0,
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
  state = true;

  textLoader: string = "Cargando...";
  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  typeFormSelected: string = "formAdd";
  elementType: string = "prestamo";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;

  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  formSelected: FormGroup;

  currentUser: Usuario | null = null;
  subscription: Subscription = new Subscription();

  private _globalService = inject(GlobalService);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _loaderService = inject(LoaderService);

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
    //console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillLeave() {
    console.log("Componente prestamosPage destruido");
    //Resetear paginacion
    this.currentPage = 1;
    this.currentPageSize = 10;
    this.totalPages = 0;
  }

  ionViewWillEnter() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    firstValueFrom(this._authService.getUserInfo())
      .then((user: any) => {
        this.currentUser = user;
        // console.log("Usuario actual en Prestamos: ", this.currentUser);
        this.getEstadosAprobacion();
        this.getCountElements();
        this.buildColumns();
        this.buildColumnsPlan();
      })
      .catch((error: any) => {
        console.error("Error al obtener información del usuario:", error);
      });

    // this.subscription = this._authService.getUserInfo().subscribe({
    //   next: (user: any) => {
    //     this.currentUser = user;
    //     console.log("Usuario actual en Prestamos: ", this.currentUser);
    //   },
    //   error: (error: any) => {
    //     console.error("Error al obtener información del usuario:", error);
    //   },
    //   complete: () => {
    //     this.subscription?.unsubscribe();
    //   },
    // });

    //console.log("Usuario actual: ", this.currentUser);
  }

  //TODO: ESPECIFICO
  getEstadosAprobacion() {
    firstValueFrom(this._globalService.Get("estados-internos")).then(
      (data: any) => {
        this.estadosAprobacion = data;
      }
    );
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
      { key: "monto", alias: "Monto Cuota", type: "currency" },
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
        key: "id",
        alias: "Código Prestamo",
      },
      {
        key: "cliente.usuarioCliente.usuarioId",
        alias: "Código Asesor",
        type: "code",
      },
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
        combineFormat: (nombres, apellidos) => `${nombres} ${apellidos}`,
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
        key: "estadoInterno.nombre",
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
      formData.planPago.fechaInicio = this._globalService.formatDateForInput(
        formData.planPago.fechaInicio
      );
      if (formData.fechaFinal) {
        formData.fechaFinal = this._globalService.formatDateForInput(
          formData.fechaFinal
        );
      }
    }
    //console.log("Form Data:", formData);
    this.element = formData;

    form.get("fechaInicio")?.setValue(formData.planPago.fechaInicio);
    form.get("idEstadoInterno")?.setValue(formData.idEstadoInterno);

    // //console.log("Modal Template: ", modalTemplate);
    // //console.log("Form Select: ", form);

    this.modalSelected = modalTemplate;
    this.formSelected = form;
    this.typeFormSelected = "formAprobar";
    this.isModalOpen = true;
  }

  onFilterButtonClicked() {
    this.state = !this.state;

    this.currentPage = 1;
    this.getCountElements();
  }
  onAddButtonClicked() {
    this._router.navigate(["/layout/gestion-prestamo"]);
    // this._router.navigate(["/layout"]);
  }

  onEditButtonClicked(data: any) {
    this._router.navigate(["/layout/gestion-prestamo/" + data.idEncrypted]);
  }

  onContractButtonClicked(data: any) {
    //console.log("Contrato del cliente:", data);
    this._router.navigate(["/layout/gestion-contrato/" + data.idEncrypted]);
  }

  onPagoButtonClicked(data: any) {
    //console.log("Contrato del cliente:", data);
    this._router.navigate(["/layout/gestion-pago/" + data.idEncrypted]);
  }

  onInfoButtonClicked(data: any) {
    // //console.log("Información del cliente:", data);
    this.element = data;
    this.modalSelected = this.modalViewInfo;
    this.isModalOpen = true;
  }

  onPlanButtonClicked(data: any) {
    //console.log("Información del prestamo:", data);
    firstValueFrom(
      this._globalService.Get("fechas-pagos/plan/" + data.planPago.id)
    )
      .then((response: any) => {
        //console.log("Plan de pago:", response);
        this.proyeccionesPlan = response;
        //Agregar columna numero correlativo
        this.proyeccionesPlan.forEach((plan: any) => {
          plan.numero = this.proyeccionesPlan.indexOf(plan) + 1;
        });
        this.modalSelected = this.modalViewPlan;
        this.isModalOpen = true;
      })
      .catch((error: any) => {
        console.error("Error al obtener el plan de pago:", error);
        this._loaderService.hide();
        this.toastMessage = "Error al obtener el plan de pago";
        this.setOpenedToast(true);
      });
  }

  onCheckButtonClicked(data: any) {
    this.setModalState(false, this.modalAprobar, this.formAprobar, data);
  }

  onDeleteButtonClicked(data: any) {
    //console.log("Eliminar presta,mo Obtenido:", data);
    this.textLoader = "Eliminando prestamo";
    this._loaderService.show();

    firstValueFrom(this._globalService.Delete("prestamos", data.id))
      .then((response: any) => {
        //console.log("cliente eliminado:", response);
        this.getCountElements();
        this._loaderService.hide();
        this.toastMessage = "prestamo eliminado correctamente";
        this.setOpenedToast(true);
      })
      .catch((error: any) => {
        console.error("Error al eliminar el prestamo:", error);
        this._loaderService.hide();
        this.toastMessage = "Error al eliminar el prestamo";
        this.setOpenedToast(true);
      });
  }

  handleSave(data: any) {
    //TODO ONLY DEBUG
    // //console.log(`Datos del formulario: `, data);
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

  handleUserOperation(operation: "edit" | "create", data: any): void {
    const { operationText, apiCall } = this.getOperationConfigElement(
      operation,
      data
    );

    this.textLoader = `${operationText} ${this.elementType}`;
    this._loaderService.show();

    //TODO COMENTAR
    //console.log(`Datos del ${this.elementType}: `, data);

    firstValueFrom(apiCall)
      .then((response: any) =>
        this.handleOperationSuccess(response, operationText)
      )
      .catch((error: any) => this.handleOperationError(error, operationText));
  }

  handleAprobar(operation: "create", data: any): void {
    const { operationText, apiCall } = this.getOperationConfigCheck(
      operation,
      data
    );

    this.textLoader = `${operationText} ${this.elementType}`;
    // this._loaderService.show();

    //TODO COMENTAR
    //console.log(`Datos del ${this.elementType}: `, data);

    firstValueFrom(apiCall)
      .then((response: any) =>
        this.handleOperationSuccess(response, operationText)
      )
      .catch((error: any) => this.handleOperationError(error, operationText));
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
    operation: "create",
    data: any
  ): { operationText: string; apiCall: Observable<any> } {
    const monto =
      this.element.totalMonto / (this.element.planPago?.cuotasPagar || 1);
    const dataSave = {
      idPrestamo: this.element.id,
      planId: this.element.idPlan,
      estado: this.element.planPago?.estado || false,
      monto,
      // fechaInicio: new Date(data.fechaInicio),
      fechaInicio: data.fechaInicio,
      periodoCobro: this.element.idPeriodoCobro,
      numeroCuotas: this.element.planPago?.cuotasPagar || 0,
      idEstadoInterno: data.idEstadoInterno || 0,
    };
    switch (operation) {
      case "create":
        //TODO ONLY DEBUG
        //console.log("Entro aquí: ", dataSave);
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
    //console.log(`cliente ${operationText.toLowerCase()}:`, response);
    this.isModalOpen = false;
    this._loaderService.hide();
    this.toastColor = "success";
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
      error.error.error.message
    );
    this._loaderService.hide();
    this.toastColor = "danger";
    this.toastMessage = `Error ${operationText.toLowerCase()} el ${
      this.elementType
    }, detalles: ${error.error.error.message || "Ocurrió un error inesperado"}`;
    this.setOpenedToast(true);
  }

  onPageChange(event: any) {
    //console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    this.getElementsPag();
  }

  async onSearchData(event: any): Promise<void> {
    //console.log("Evento de búsqueda:", event);
    const idUser = this.currentUser?.id;
    try {
      if (event === "") {
        await this.getCountElements();
      } else {
        await firstValueFrom(
          this._globalService
            .Get(
              `prestamos/search/${idUser}?query=${event}&state=${this.state}`
            )
            .pipe(
              tap((res: any) => {
                this.elements = res;
                //console.log("Elementos obtenidos:", res);
              }),
              catchError((error) => {
                console.error("Error al obtener los elementos:", error);
                throw error;
              })
            )
        );
      }
    } catch (error) {
      console.error("Error en onSearchData:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  }

  private async getElementsPag(): Promise<void> {
    const idUser = this.currentUser?.id;
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    try {
      await firstValueFrom(
        this._globalService
          .Get(
            `prestamos/paginated/${idUser}?skip=${skip}&limit=${limit}&state=${this.state}`
          )
          .pipe(
            tap((res: any) => {
              this.elements = res;
              // console.log("Elementos obtenidos:", res);
            }),
            catchError((error) => {
              console.error("Error al obtener los elementos:", error);
              throw error;
            })
          )
      );
    } catch (error) {
      console.error("Error en getElementsPag:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  }

  private async getCountElements(): Promise<void> {
    const idUser = this.currentUser?.id;
    try {
      await firstValueFrom(
        this._globalService
          .Get(`prestamos/count/${idUser}?state=${this.state}`)
          .pipe(
            tap((res: any) => {
              //console.log("Cantidad de elementos:", res.count);
              const totalElements = res.count;
              this.totalPages = Math.ceil(totalElements / this.currentPageSize);
              //console.log("Total de páginas:", this.totalPages);
            }),
            catchError((error) => {
              console.error(
                "Error al obtener la cantidad de elementos:",
                error
              );
              throw error;
            })
          )
      );

      // Llamar a getElementsPag después de obtener el conteo
      await this.getElementsPag();
    } catch (error) {
      console.error("Error en getCountElements:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  }
}
