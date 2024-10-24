import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  isEmpty,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { Personas } from "src/app/shared/interfaces/persona";
import { Roles } from "src/app/shared/interfaces/rol";
import { Column } from "src/app/shared/interfaces/table";
import { Usuario } from "src/app/shared/interfaces/usuario";
import { GlobalService } from "src/app/shared/services/global.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { FieldAliases, ModalConfig } from "src/app/shared/utils/extra";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.page.html",
  styleUrls: ["./usuarios.page.scss"],
})
export class UsuariosPage implements OnInit {
  elements: Usuario[] = [];
  element: Usuario = {
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    observacion: "",
    ad: false,
    estado: false,
    changedPassword: false,
    rolid: 0,
    rol: {
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

  textLoader: string = "Cargando";
  toastMessage: string = "Usuario guardado correctamente";
  toastColor: string = "primary";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;
  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);
  private _alertController = inject(AlertController);
  private _loaderService = inject(LoaderService);

  // TODO: Atributos Especificos
  @ViewChild("modalResetPswd", { static: true })
  modalResetPswd!: TemplateRef<any>;

  @ViewChild("modalSelectClients", { static: true })
  modalSelectClients!: TemplateRef<any>;

  @ViewChild("modalTransfer", { static: true })
  modalTransfer!: TemplateRef<any>;

  modalConfig: ModalConfig = { fieldAliases: {} };

  selectedClients: Personas[] = [];
  filteredClients: Personas[] = [];

  searchPlaceHolder = "Buscar Cliente...";
  searchClient: string = "";
  searchUser: string = "";
  searchClient$ = new Subject<string>();
  searchUser$ = new Subject<string>();

  loading = false;

  formResetPswd: FormGroup;
  roles: Roles[] = [];

  isElement = false;
  //TODO ESPECIFICOS
  isResetPswd = false;
  isSelectClients = false;
  isTransfer = false;

  selectedUser: Usuario = {
    id: 0,
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    observacion: "",
    ad: false,
    estado: false,
    changedPassword: false,
    rolid: 0,
    rol: {
      id: 0,
      nombre: "",
    },
  };

  filteredUsers: Usuario[] = [];

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.usuarioForm();
    this.formSelected = this.formAdd;
    //console.log("Formulario de usuario:", this.formAdd);

    //TODO ESPECIFICO
    this.formResetPswd = this.formModels.resetPswdForm();
  }

  ngOnInit() {
    this.initSearcher();
  }

  ionViewWillEnter() {
    this.getRoles();
    this.getCountElements();
    this.buildColumns();
  }

  initSearcher() {
    this.searchClient$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        if (
          this.searchClient.trim() === "" ||
          this.searchClient.trim().length < 3
        ) {
          this.filteredClients = [];
        } else {
          this.searchDataClients();
        }
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });

    this.searchUser$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        if (
          this.searchUser.trim() === "" ||
          this.searchUser.trim().length < 3
        ) {
          this.filteredUsers = [];
        } else {
          this.searchDataUsers();
        }
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });
  }

  searchValueChanged(event: any, type: string) {
    //console.log("Search value changed:", event.target.value, type);
    switch (type) {
      case "client":
        this.searchClient$.next(event.target.value);
        break;
      case "user":
        this.searchUser$.next(event.target.value);
        break;
    }
  }

  searchDataClients() {
    const idUser = this.element.id;
    firstValueFrom(
      this._globalService.Get(
        `personas/clientes/search/${idUser}?query=${this.searchClient}`
      )
    )
      .then((data: any) => {
        //console.log(`Clientes encontrados para ${this.searchClient}:`, data);
        this.filteredClients = data;
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
  }

  searchDataUsers() {
    firstValueFrom(
      this._globalService.Get(
        `usuarios/asesores/search?query=${this.searchUser}`
      )
    )
      .then((data: any) => {
        //console.log(`Asesores encontrados para ${this.searchUser}:`, data);
        this.filteredUsers = data;
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
  }

  toggleSelection(clientOp: any) {
    //Eliminar o insertar cliente del array this.selectedClients segun caso.

    // Verifica si el cliente ya está en la lista de seleccionados
    if (this.selectedClients.some((client) => client.dni === clientOp.dni)) {
      //console.log("Remover Cliente:", clientOp);
      this.removeClient(clientOp);
    } else {
      //console.log("Agregar Cliente:", clientOp);

      const usuarioClient = {
        usuarioId: this.element.id,
        clienteId: clientOp.id,
      };

      //console.log("Usuario-Cliente:", usuarioClient);
      const suscription = firstValueFrom(
        this._globalService.Post("usuario-clientes/one", usuarioClient)
      )
        .then(() => {
          this.selectedClients.push(clientOp);
          //console.log("Cliente agregado correctamente");
          this.toastColor = "success";
          this.toastMessage = "Cliente agregado correctamente";
          this.isToastOpen = true;
        })
        .catch((error) => {
          console.error("Error al agregar cliente:", error);
        });
    }
  }

  async setTransfer(usuario: any) {
    //console.log("Set transfer: ", usuario);

    //Alerta de si esta seguro de transferir al usuario
    const alert = await this._alertController.create({
      header: "Transferir asesor",
      message: `¿Está seguro de transferir al asesor ${usuario.apellido}, ${usuario.nombre}?`,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //console.log("Transferencia cancelada");
          },
        },
        {
          text: "Transferir",
          handler: () => {
            //TODO ESPECIFICOS
            this.isResetPswd = true;
            this.selectedUser = usuario;
            //console.log("Transferencia realizada correctamente");
            this.toastColor = "success";
            this.toastMessage = "Transferencia realizada correctamente";
            this.isToastOpen = true;
          },
        },
      ],
    });

    await alert.present();
  }

  async removeClient(clientRemove: Personas) {
    const alert = await this._alertController.create({
      header: "Eliminar elemento",
      message: "¿Realmente deseas eliminar este elemento?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            //console.log("Eliminación cancelada");
          },
        },
        {
          text: "Eliminar",
          handler: () => {
            firstValueFrom(
              this._globalService.Delete(
                "usuario-clientes/by-cliente",
                clientRemove.id || 0
              )
            )
              .then(() => {
                //console.log("Cliente eliminado correctamente");
                this.toastColor = "success";
                this.toastMessage = "Cliente eliminado correctamente";
                this.isToastOpen = true;
                this.selectedClients = this.selectedClients.filter(
                  (client) => client.dni !== clientRemove.dni
                );
              })
              .catch((error) => {
                console.error("Error al eliminar cliente:", error);
                this.toastColor = "danger";
                this.toastMessage = "Error al eliminar cliente";
                this.isToastOpen = true;
              });
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewWillLeave() {}
  // TODO ESPECIFICO
  onSelect(items: Personas[]) {
    //console.log("Items SelectedItems:", this.selectedClients);
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
        key: "id",
        alias: "Código",
      },
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
        key: "rol.descripcion",
        alias: "Rol",
      },
      {
        key: "ad",
        alias: "AD",
        type: "boolean",
        options: ["Activo", "Inactivo"],
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Activo", "Inactivo"],
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
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Editar",
            action: "edit",
            icon: "create",
            color: "primary",
            rolesAuthorized: [1],
          },
          {
            alias: "Asignar clientes",
            action: "asignClients",
            icon: "people",
            color: "primary",
            rolesAuthorized: [1],
          },
          {
            alias: "Transferir",
            action: "transfer",
            icon: "shuffle",
            color: "warning",
            rolesAuthorized: [1],
          },
          {
            alias: "Contraseña",
            action: "resetPswd",
            icon: "key",
            color: "tertiary",
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

  getCellValue(row: any, key: string): any {
    const result = key.split(".").reduce((o, k) => (o || {})[k], row);

    // //console.log("Resultado de la celda:", result);
    return result;
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
    isElement: boolean,
    isResetPswd: boolean,
    isSelectClients: boolean,
    isTransfer: boolean,
    modalTemplate: TemplateRef<any>,
    formSelected?: FormGroup<any>
  ) {
    this.isEdit = isEdit;
    this.isElement = isElement;
    this.isResetPswd = isResetPswd;
    this.isSelectClients = isSelectClients;
    this.isTransfer = isTransfer;

    this.modalSelected = modalTemplate;
    if (formSelected) {
      this.formSelected = formSelected;
    }
    this.isModalOpen = true;
  }

  setFieldAliases() {
    const fieldAliases: FieldAliases = {
      ad: "AD",
      apellido: "Apellido",
      changedPassword: "Contraseña modificada",
      correo: "Correo electrónico",
      estado: "Estado",
      nombre: "Nombre",
      observacion: "Observación",
      rolid: "Rol",
      telefono: "Teléfono",
    };

    this.modalConfig = {
      fieldAliases,
    };
  }

  onAddButtonClicked() {
    this.cleanForm();
    this.setFieldAliases();
    this.setModalState(
      false,
      true,
      false,
      false,
      false,
      this.modalAdd,
      this.formAdd
    );
  }

  onEditButtonClicked(data: any) {
    this.setFieldAliases();
    this.formAdd.patchValue(data);
    this.setModalState(
      true,
      true,
      false,
      false,
      false,
      this.modalAdd,
      this.formAdd
    );
  }

  //TODO ESPECIFICO
  onResetPasswordButtonClicked(data: any) {
    //console.log("Data: ", data);
    this.formResetPswd.get("identificator")?.setValue(data.correo);

    const fieldAliases: FieldAliases = {
      identificator: "Correo electrónico",
      newPassword: "Contraseña",
    };
    this.modalConfig = {
      fieldAliases,
    };

    this.setModalState(
      false,
      false,
      true,
      false,
      false,
      this.modalResetPswd,
      this.formResetPswd
    );
  }

  onTransferButtonClicked(data: any) {
    //console.log("Data: ", data);
    this.element = data;
    this.setModalState(false, false, false, false, true, this.modalTransfer);
  }

  onSelectClientsButtonClicked(data: any) {
    //console.log("Data: ", data);
    this.element = data;
    this.filteredClients = [];
    this.selectedClients = [];

    firstValueFrom(
      this._globalService.Get(`usuario-clientes/by-usuario/${data.id}`)
    )
      .then((response: any) => {
        //console.log("Clientes del usuario:", response);
        this.setModalState(
          false,
          false,
          false,
          true,
          false,
          this.modalSelectClients
        );
        this.selectedClients = response;
      })
      .catch((error: any) => {
        console.error("Error al obtener clientes del usuario:", error);
      });
  }

  onInfoButtonClicked(data: any) {
    // //console.log("Información del usuario:", data);
    this.element = data;
    this.setModalState(false, false, false, false, false, this.modalViewInfo);
  }

  onDeleteButtonClicked(data: any) {
    //console.log("Eliminar usuario Obtenido:", data);
    this.textLoader = "Eliminando Usuario";
    this._loaderService.show();

    firstValueFrom(this._globalService.Delete("usuarios", data.id))
      .then((response: any) => {
        //console.log("Usuario eliminado:", response);
        this.getCountElements();
        this._loaderService.hide();
        this.toastMessage = "Usuario eliminado correctamente";
        this.setOpenedToast(true);
      })
      .catch((error: any) => {
        console.error("Error al eliminar el usuario:", error);
        this._loaderService.hide();
        this.toastMessage = "Error al eliminar el usuario";
        this.setOpenedToast(true);
      });
  }

  async handleSave(data: any) {
    //console.log("Data a Guardar: ", data);

    if (this.isResetPswd) {
      this.handleUserOperation("resetPswd", data);
    } else if (this.isElement) {
      data = this.prepareData(data);
      if (this.isEdit) {
        this.handleUserOperation("edit", data);
      } else {
        delete data.id;
        this.handleUserOperation("create", data);
      }
    }
  }

  private prepareData(data: any) {
    data.correo = data.correo || "no-email@example.com";
    data.telefono = data.telefono.replace(/-/g, "");

    return data;
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
    this._loaderService.show();

    firstValueFrom(apiCall)
      .then((response: any) => {
        //console.log(`Usuario ${operationText.toLowerCase()}:`, response);
        this.isModalOpen = false;
        this._loaderService.hide();
        this.toastMessage = `Usuario ${operationText.toLowerCase()} correctamente`;
        this.setOpenedToast(true);
        this.cleanForm();
        this.getCountElements();
      })
      .catch((error: any) => {
        console.error(
          `Error al ${operationText.toLowerCase()} el usuario:`,
          error
        );
        this._loaderService.hide();
        this.toastMessage = `Error al ${operationText.toLowerCase()} el usuario`;
      });
  }

  onPageChange(event: any) {
    //console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    this.getElementsPag();
  }

  onSearchData(event: any) {
    //console.log("Evento de búsqueda:", event);
    if (event === "") {
      this.getCountElements();
    } else {
      firstValueFrom(this._globalService.Get(`usuarios/search?query=${event}`))
        .then((response: any) => {
          this.elements = response;
          //console.log("Elementos obtenidos:", response);
        })
        .catch((error) => {
          console.error("Error al obtener los elementos:", error);
        });
    }
  }

  getElementsPag() {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    firstValueFrom(
      this._globalService.Get(`usuarios/paginated?skip=${skip}&limit=${limit}`)
    )
      .then((response: any) => {
        this.elements = response;
        //console.log("Elementos obtenidos:", response);
      })
      .catch((error) => {
        console.error("Error al obtener los elementos:", error);
      });
  }

  getCountElements() {
    firstValueFrom(this._globalService.Get("usuarios/count"))
      .then((response: any) => {
        //console.log("Cantidad de elementos:", response.count);
        const totalElements = response.count;
        this.totalPages = Math.ceil(totalElements / this.currentPageSize);
        //console.log("Total de páginas:", this.totalPages);
        this.getElementsPag();
      })
      .catch((error) => {
        console.error("Error al obtener la cantidad de elementos:", error);
      });
  }

  // TODO: ESPECIFICO
  getRoles() {
    firstValueFrom(this._globalService.Get("roles"))
      .then((roles: any) => {
        this.roles = roles;
        //console.log("Roles obtenidos:", this.roles);
      })
      .catch((error) => {
        console.error("Error al obtener los roles:", error);
      });
  }
}
