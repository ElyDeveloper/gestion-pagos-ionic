import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { Personas } from "src/app/shared/interfaces/persona";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { FieldAliases, ModalConfig } from "src/app/shared/utils/extra";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.page.html",
  styleUrls: ["./clientes.page.scss"],
})
export class ClientesPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;
  elements: Personas[] = [];
  element: Personas = {
    dni: "",
    nombres: "",
    apellidos: "",
    cel: "",
    direccion: "",
    email: "",
    fechaIngreso: "",
    fechaBaja: "",
    estado: false,
    idNacionalidad: 1,
    idRecordCrediticio: 1,
    idEstadoCivil: 1,
    idTipoPersona: 1,
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
  title: string = "Todos";
  action: string = "todos";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;
  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  modalConfig: ModalConfig = { fieldAliases: {} };
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);

  //TODO: Elementos propios del componente
  nacionalidades: any[] = [];
  recordsCrediticios: any[] = [];
  estadosCiviles: any[] = [];
  tiposPersona: any[] = [];

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.personasForm();
    this.formSelected = this.formAdd;
    console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {
    this.getCountElements();
    this.buildColumns();
    this.cargarOpciones();
  }

  //TODO: ESPECIFICO
  goAction(action: string) {
    console.log("Accion capturada: ", action);
    this.title = action;
    this.action = action.toLowerCase();
    this.getCountElements();
  }

  //TODO: ESPECIFICO
  cargarOpciones() {
    this._globalService.Get("nacionalidades").subscribe((data: any) => {
      this.nacionalidades = data;
    });
    this._globalService.Get("record-crediticios").subscribe((data: any) => {
      this.recordsCrediticios = data;
    });
    this._globalService.Get("estado-civils").subscribe((data: any) => {
      this.estadosCiviles = data;
    });
    this._globalService.Get("tipo-personas").subscribe((data: any) => {
      this.tiposPersona = data;
    });
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  cleanForm() {
    this.formAdd.reset();
    this.formAdd = this.formModels.personasForm();
  }

  buildColumns() {
    this.columnsData = [
      {
        key: "nombres",
        alias: "Nombres",
      },
      {
        key: "apellidos",
        alias: "Apellidos",
      },
      {
        key: "dni",
        alias: "DNI",
        type: "dni",
      },
      {
        key: "cel",
        alias: "Celular",
      },
      {
        key: "direccion",
        alias: "Dirección",
      },
      {
        key: "email",
        alias: "Correo",
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
      },
      {
        key: "fechaIngreso",
        alias: "Fecha de Ingreso",
        type: "date",
      },
      {
        key: "fechaBaja",
        alias: "Fecha de Baja",
        type: "date",
      },
      {
        key: "estadoCivil.descripcion",
        alias: "Estado Civil",
      },
      {
        key: "nacionalidad.descripcion",
        alias: "Nacionalidad",
      },
      {
        key: "recordCrediticio.descripcion",
        alias: "Récord Crediticio",
      },
      {
        key: "tipoPersona.descripcion",
        alias: "Tipo de Persona",
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
            alias: "Información",
            action: "info",
            icon: "information",
            color: "tertiary",
            rolesAuthorized: [1, 2, 3],
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
      formData = this._globalService.parseObjectDates(formData);
    }
    console.log("Form Data:", formData);

    if (isEdit && formData) {
      this.formAdd.patchValue(formData);
    } else if (!isEdit) {
      this.cleanForm();
    }

    const fieldAliases = this.columnsData.reduce<FieldAliases>((acc, col) => {
      if (col.key !== "actions") {
        acc[col.key] = col.alias;
      }
      return acc;
    }, {});

    // Asignar este objeto al modalConfig
    this.modalConfig = {
      fieldAliases: fieldAliases,
      // ... otras configuraciones del modal si las tienes
    };

    this.modalSelected = modalTemplate;
    this.formSelected = this.formAdd;
    this.isModalOpen = true;
  }

  onAddButtonClicked() {
    this.setModalState(false, this.modalAdd);
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
    this._globalService.Delete("personas", data.id).subscribe({
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

  handleUserOperation(operation: "edit" | "create", data: any) {
    data.fechaIngreso = new Date(data.fechaIngreso);
    console.log("Datos del cliente:", data);

    // return;
    let operationText: string;
    let apiCall: Observable<any>;

    switch (operation) {
      case "edit":
        operationText = "Editado";
        apiCall = this._globalService.PutId("personas", data.id, data);
        break;
      case "create":
        delete data.Id;
        operationText = "Guardado";
        apiCall = this._globalService.Post("personas", data);
        break;
    }

    this.textLoader = `${operationText} cliente`;
    this.loaderComponent.show();

    apiCall.subscribe({
      next: (response: any) => {
        console.log(`cliente ${operationText.toLowerCase()}:`, response);
        this.isModalOpen = false;
        this.loaderComponent.hide();
        this.toastMessage = `cliente ${operationText.toLowerCase()} correctamente`;
        this.setOpenedToast(true);
        this.cleanForm();
        this.getCountElements();
      },
      error: (error: any) => {
        console.error(
          `Error al ${operationText.toLowerCase()} el cliente:`,
          error
        );
        this.loaderComponent.hide();
        this.toastMessage = `Error al ${operationText.toLowerCase()} el cliente`;
      },
    });
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
      this._globalService
        .Get(`personas/${this.action}/search?query=${event}`)
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
  }

  getElementsPag() {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    this._globalService
      .Get(`personas/${this.action}/paginated?skip=${skip}&limit=${limit}`)
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
    this._globalService.Get("personas/count").subscribe({
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
