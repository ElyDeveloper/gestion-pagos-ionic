import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SplashScreen } from "@capacitor/splash-screen";
import { debounceTime, distinctUntilChanged, Observable, Subject } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { ReusableModalComponent } from "src/app/shared/components/reusable-modal/reusable-modal.component";
import { TableDataComponent } from "src/app/shared/components/table-data/table-data.component";
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
  currentPage = 1;
  currentPageSize = 10;
  totalPages = 0;

  columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)

  formUser: FormGroup;
  formResetPswd: FormGroup;
  formModels: FormModels;

  searchTerm$ = new Subject<string>();
  isModalOpen = false;
  isToastOpen = false;
  isEdit = false;

  search: string = "";
  textLoader: string = "Cargando...";
  toastMessage: string = "Usuario guardado correctamente";

  private _globalService = inject(GlobalService);
  @ViewChild("modalAddUser", { static: true }) modalAddUser!: TemplateRef<any>;
  @ViewChild("modalResetPswd", { static: true })
  modalResetPswd!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAddUser;

  // TODO: Atributos Especificos
  roles: Rol[] = [];
  isResetPswd = false;

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formUser = this.formModels.usuarioForm();
    this.formResetPswd = this.formModels.resetPswdForm();
  }

  ngOnInit() {
    this.initSearcher();
    this.getRoles();
    this.getCountElements();
    this.buildColumns();
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  cleanForm() {
    this.formUser.reset();
    this.formResetPswd.reset();
    this.formUser = this.formModels.usuarioForm();
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
        key: "rolesUsuario.nombre",
        alias: "Rol",
      },
      {
        key: "telefono",
        alias: "Teléfono",
      },
      {
        key: "correo",
        alias: "Correo",
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

  private setModalState(
    isEdit: boolean,
    isResetPswd: boolean,
    modalTemplate: any,
    formData?: any
  ) {
    this.isEdit = isEdit;
    this.isResetPswd = isResetPswd;
    this.modalSelected = modalTemplate;
    this.isModalOpen = true;

    if (isEdit && formData && !isResetPswd) {
      this.formUser.patchValue(formData);
    } else if (!isEdit && !isResetPswd) {
      this.cleanForm();
    } else if (isResetPswd) {
      this.formResetPswd.patchValue(formData);
    }
  }

  onAddButtonClicked() {
    this.setModalState(false, false, this.modalAddUser);
  }

  onEditButtonClicked(data: any) {
    this.setModalState(true, false, this.modalAddUser, data);
  }

  onResetPasswordButtonClicked(data: any) {
    this.setModalState(false, true, this.modalResetPswd, data);
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
        console.error(`Error al ${operationText.toLowerCase()} el usuario:`, error);
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

  initSearcher() {
    this.searchTerm$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        this.search === "" ? this.getElementsPag() : this.searchElements();
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });
  }

  searchValueChanged(event: any) {
    const target = event?.target as HTMLInputElement;
    if (target) {
      this.searchTerm$.next(target.value);
    }
  }

  searchElements() {}

  onPageChange(event: any) {
    console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    this.getElementsPag();
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

  // TODO: Funcionalidades Especificas

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
