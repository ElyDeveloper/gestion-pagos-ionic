import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, Observable, Subject } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { Rol } from "src/app/shared/interfaces/rol";
import { Column } from "src/app/shared/interfaces/table";
import { Usuario } from "src/app/shared/interfaces/usuario";
import { GlobalService } from "src/app/shared/services/global.service";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.page.html",
  styleUrls: ["./usuarios.page.scss"],
})
export class UsuariosPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  elements: Usuario[] = [];
  element: Usuario = {
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    observacion: "",
    ad: false,
    estado: false,
    rolesUsuario: {
      id: 0,
      nombre: "",
    },
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
  toastMessage: string = "Usuario guardado correctamente";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;
  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);

  // TODO: Atributos Especificos
  @ViewChild("modalResetPswd", { static: true })
  modalResetPswd!: TemplateRef<any>;

  formResetPswd: FormGroup;
  roles: Rol[] = [];
  isResetPswd = false;

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.usuarioForm();
    this.formSelected = this.formAdd;
    console.log("Formulario de usuario:", this.formAdd);

    //TODO ESPECIFICO
    this.formResetPswd = this.formModels.resetPswdForm();
  }

  ngOnInit() {
    this.getRoles();
    this.getCountElements();
    this.buildColumns();
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  cleanForm() {
    this.formAdd.reset();
    this.formResetPswd.reset();

    this.formAdd = this.formModels.usuarioForm();
    this.formResetPswd = this.formModels.resetPswdForm();
  }

  buildColumns() {
    this.columnsData = [
      {
        key: "nombre",
        alias: "Nombre",
      },
      {
        key: "apellido",
        alias: "Apellido",
      },
      {
        key: "correo",
        alias: "Correo",
      },
      {
        key: "rol.nombre",
        alias: "Rol",
      },
      {
        key: "telefono",
        alias: "Teléfono",
      },

      {
        key: "observacion",
        alias: "Observación",
      },
      {
        key: "ad",
        alias: "AD",
        type: "boolean",
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
      },
      {
        key: "actions",
        alias: "Acciones",
        type: "pswd",
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

  private setModalState(
    isEdit: boolean,
    isResetPswd: boolean,
    modalTemplate: any,
    formData?: any
  ) {
    this.isEdit = isEdit;
    this.isResetPswd = isResetPswd;
    
    
    if (isEdit && formData && !isResetPswd) {
      this.formAdd.patchValue(formData);
    } else if (!isEdit && !isResetPswd) {
      this.cleanForm();
    } else if (isResetPswd) {
      this.formResetPswd.patchValue(formData);
    }

    this.modalSelected = modalTemplate;
    this.formSelected = isResetPswd ? this.formResetPswd : this.formAdd;
    this.isModalOpen = true;
  }

  onAddButtonClicked() {
    this.setModalState(false, false, this.modalAdd);
  }

  onEditButtonClicked(data: any) {
    this.setModalState(true, false, this.modalAdd, data);
  }

  //TODO ESPECIFICO
  onResetPasswordButtonClicked(data: any) {
    this.setModalState(false, true, this.modalResetPswd, data);
  }

  onInfoButtonClicked(data: any) {
    // console.log("Información del usuario:", data);
    this.element = data;
    this.modalSelected = this.modalViewInfo;
    this.isModalOpen = true;
  }

  onDeleteButtonClicked(data: any) {
    console.log("Eliminar usuario Obtenido:", data);
    this.textLoader = "Eliminando Usuario";
    this.loaderComponent.show();
    this._globalService.Delete("usuarios", data.id).subscribe({
      next: (response: any) => {
        console.log("Usuario eliminado:", response);
        this.getCountElements();
        this.loaderComponent.hide();
        this.toastMessage = "Usuario eliminado correctamente";
        this.setOpenedToast(true);
      },
      error: (error: any) => {
        console.error("Error al eliminar el usuario:", error);
        this.loaderComponent.hide();
        this.toastMessage = "Error al eliminar el usuario";
        this.setOpenedToast(true);
      },
    });
  }

  handleUserOperation(operation: "edit" | "create" | "resetPswd", data: any) {
    let operationText: string;
    let apiCall: Observable<any>;

    switch (operation) {
      case "edit":
        operationText = "Editando";
        apiCall = this._globalService.PutId("usuarios", data.id, data);
        break;
      case "create":
        operationText = "Guardando";
        apiCall = this._globalService.Post("usuarios", data);
        break;
      case "resetPswd":
        operationText = "Restableciendo contraseña de";
        apiCall = this._globalService.Post("reset-password", data);
        break;
    }

    this.textLoader = `${operationText} Usuario`;
    this.loaderComponent.show();

    apiCall.subscribe({
      next: (response: any) => {
        console.log(`Usuario ${operationText.toLowerCase()}:`, response);
        this.isModalOpen = false;
        this.loaderComponent.hide();
        this.toastMessage = `Usuario ${operationText.toLowerCase()} correctamente`;
        this.setOpenedToast(true);
        this.cleanForm();
        this.getCountElements();
      },
      error: (error: any) => {
        console.error(
          `Error al ${operationText.toLowerCase()} el usuario:`,
          error
        );
        this.loaderComponent.hide();
        this.toastMessage = `Error al ${operationText.toLowerCase()} el usuario`;
      },
    });
  }

  async handleSave(data: any) {
    if (this.isEdit && !this.isResetPswd) {
      this.handleUserOperation("edit", data);
    } else if (!this.isResetPswd && !this.isEdit) {
      delete data.id;
      this.handleUserOperation("create", data);
    } else if (this.isResetPswd) {
      this.handleUserOperation("resetPswd", data);
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
      this._globalService.Get(`usuarios/search?query=${event}`).subscribe({
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
      .Get(`usuarios/paginated?skip=${skip}&limit=${limit}`)
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
    this._globalService.Get("usuarios/count").subscribe({
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

  // TODO: ESPECIFICO
  getRoles() {
    this._globalService.Get("roles").subscribe({
      next: (roles: any) => {
        this.roles = roles;
        console.log("Roles obtenidos:", this.roles);
      },
      error: (error) => {
        console.error("Error al obtener los roles:", error);
      },
    });
  }
}
