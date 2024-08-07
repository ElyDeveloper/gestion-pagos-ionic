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
import { Cliente } from "src/app/shared/interfaces/cliente";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.page.html",
  styleUrls: ["./clientes.page.scss"],
})
export class ClientesPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  // export interface Cliente {
  //   Id?: number;
  //   DNI?: string;
  //   Nombres?: string;
  //   Apellidos?: string;
  //   Cel?: string;
  //   Direccion?: string;
  //   Email?: string;
  //   FechaIngreso?: string;
  //   FechaBaja?: string;
  //   Estado?: boolean;
  // }

  elements: Cliente[] = [];
  element: Cliente = {
    DNI: "",
    Nombres: "",
    Apellidos: "",
    Cel: "",
    Direccion: "",
    Email: "",
    FechaIngreso: "",
    FechaBaja: "",
    Estado: false,
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

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.clienteForm();
    this.formSelected = this.formAdd;
    console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {
    this.getCountElements();
    this.buildColumns();
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  cleanForm() {
    this.formAdd.reset();
    this.formAdd = this.formModels.clienteForm();
  }

  buildColumns() {
    this.columnsData = [
      
      {
        key: "Nombres",
        alias: "Nombres",
      },
      {
        key: "Apellidos",
        alias: "Apellidos",
      },
      {
        key: "DNI",
        alias: "DNI",
        type: "dni",
      },
      {
        key: "Cel",
        alias: "Celular",
      },
      {
        key: "Direccion",
        alias: "Dirección",
      },
      {
        key: "Email",
        alias: "Correo",
      },
      {
        key: "FechaIngreso",
        alias: "Fecha de Ingreso",
        type: "date",
      },
      {
        key: "FechaBaja",
        alias: "Fecha de Baja",
        type: "date",
      },
      {
        key: "Estado",
        alias: "Estado",
        type: "boolean",
      },
      {
        key: "actions",
        alias: "Acciones",
      },
    ];
  }

  getCellValue(row: any, key: string): any {
    return key.split(".").reduce((o, k) => (o || {})[k], row);
  }

  getObjectValue(row: any, key: string): string {
    const obj = row[key];
    if (obj && typeof obj === "object") {
      return obj.nombre || JSON.stringify(obj);
    }
    return "";
  }

  private setModalState(isEdit: boolean, modalTemplate: any, formData?: any) {
    this.isEdit = isEdit;

    if (isEdit && formData) {
      this.formAdd.patchValue(formData);
    } else if (!isEdit) {
      this.cleanForm();
    }

    this.modalSelected = modalTemplate;
    this.formSelected = this.formAdd;
    this.isModalOpen = true;
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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

  handleUserOperation(operation: "edit" | "create", data: any) {
    let operationText: string;
    let apiCall: Observable<any>;

    switch (operation) {
      case "edit":
        operationText = "Editando";
        apiCall = this._globalService.PutId("Clientes", data.id, data);
        break;
      case "create":
        operationText = "Guardando";
        apiCall = this._globalService.Post("Clientes", data);
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
      this._globalService.Get(`Clientes/search?query=${event}`).subscribe({
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
      .Get(`Clientes/paginated?skip=${skip}&limit=${limit}`)
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
    this._globalService.Get("Clientes/count").subscribe({
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
