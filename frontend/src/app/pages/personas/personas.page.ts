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
import { Personas } from "src/app/shared/interfaces/persona";
import { Column } from "src/app/shared/interfaces/table";
import { Usuario } from "src/app/shared/interfaces/usuario";
import { AuthService } from "src/app/shared/services/auth.service";
import { GlobalService } from "src/app/shared/services/global.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { FieldAliases, ModalConfig } from "src/app/shared/utils/extra";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-clientes",
  templateUrl: "./personas.page.html",
  styleUrls: ["./personas.page.scss"],
})
export class PersonasPage implements OnInit {
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
  isModalOpenX = false;
  isEdit = false;

  textLoader: string = "Cargando...";
  isToastOpen = false;
  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  title: string = "Todos";
  action: string = "todos";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;
  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  @ViewChild("modalNacionalidadSelector")
  modalNacionalidadSelector!: TemplateRef<any>;
  @ViewChild("modalAsesorSelector")
  modalAsesorSelector!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  modalConfig: ModalConfig = { fieldAliases: {} };
  modalSelectedX: TemplateRef<any> = this.modalAdd;
  modalConfigX: ModalConfig = { fieldAliases: {} };
  formSelected: FormGroup;
  formSelectedX: FormGroup;

  private _globalService = inject(GlobalService);
  private _authService = inject(AuthService);
  private _loaderService = inject(LoaderService);

  //TODO: ESPECIFICOS
  nacionalidades: any[] = [];
  asesores: any[] = [];
  recordsCrediticios: any[] = [];
  estadosCiviles: any[] = [];
  tiposPersona: any[] = [];

  suscripciones: Subscription[] = [];

  currentUser: Usuario | null = null;

  filteredNacionalidades = this.nacionalidades;
  selectedNacionalidad: any = null;
  filteredAsesores = this.asesores;
  selectedAsesor: any = null;
  lastSelectedAsesor: any = null;

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.personasForm();
    this.formSelected = this.formAdd;
    this.formSelectedX = this.formAdd;
    // //console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  ionViewWillEnter() {
    this.getCountElements();
    this.buildColumns();
    this.cargarOpciones();
  }

  openSelector(type: "nacionalidad" | "asesor") {
    switch (type) {
      case "nacionalidad":
        this.modalSelectedX = this.modalNacionalidadSelector;

        break;
      case "asesor":
        this.modalSelectedX = this.modalAsesorSelector;
        break;
      default:
        console.error("Tipo de selector no válido");
        return;
    }
    this.isModalOpenX = true;
  }

  filterNacionalidades(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm === "") {
      this.filteredNacionalidades = [];
      return;
    }

    this.filteredNacionalidades = this.nacionalidades.filter(
      (nacionalidad) =>
        nacionalidad.descripcion.toLowerCase().includes(searchTerm) ||
        nacionalidad.abreviatura.toLowerCase().includes(searchTerm)
    );
  }

  selectNacionalidad(nacionalidad: any) {
    this.selectedNacionalidad = nacionalidad;
    //console.log("Nacionalidad seleccionada: ", this.selectedNacionalidad);
    this.formAdd.patchValue({ idNacionalidad: nacionalidad.id });
    this.isModalOpenX = false;
  }

  filterAsesores(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm === "") {
      this.filteredAsesores = [];
      return;
    }
    this.filteredAsesores = this.asesores.filter(
      (asesor) =>
        asesor.nombre.toLowerCase().includes(searchTerm) ||
        asesor.apellido.toLowerCase().includes(searchTerm) ||
        asesor.correo.toLowerCase().includes(searchTerm)
    );
  }

  selectAsesor(asesor: any) {
    this.selectedAsesor = asesor;
    //console.log("Asesor seleccionada: ", this.selectedAsesor);
    this.isModalOpenX = false;
  }

  getCurrentUser() {
    this._authService.getUserInfo().subscribe({
      next: (user: any) => {
        this.currentUser = user;
        //console.log("Usuario actual: ", this.currentUser);
      },
      error: (error: any) => {
        console.error("Error al obtener información del usuario:", error);
      },
    });
    //console.log("Usuario actual: ", this.currentUser);
  }

  //TODO: ESPECIFICO
  goAction(action: string) {
    // //console.log("Accion capturada: ", action);
    this.currentPage = 1;
    this.currentPageSize = 10;
    this.title = action;
    this.action = action.toLowerCase();
    this.getCountElements();
  }

  //TODO: ESPECIFICO
  cargarOpciones() {
    this._globalService.Get("nacionalidades").subscribe((data: any) => {
      this.nacionalidades = data;
      // //console.log(this.nacionalidades);
    });
    this._globalService.GetId("usuarios/roles", 3).subscribe((data: any) => {
      this.asesores = data;
      //console.log("Asesores: ", this.asesores);
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
        key: "id",
        alias: "Código",
      },
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
        options: ["Activo", "Inactivo"],
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
        imageUrl: "nacionalidad.urlBandera",
        type: "image",
      },
      // {
      //   key: "recordCrediticio.descripcion",
      //   alias: "Récord Crediticio",
      // },
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

  private setModalState(isEdit: boolean, modalTemplate: any, formData?: any) {
    //TODO ESPEDIFICO
    this.suscripciones.forEach((sub) => sub.unsubscribe());

    this.isEdit = isEdit;

    if (formData) {
      formData = this._globalService.parseObjectDates(formData);
    }
    //console.log("Form Data:", formData);

    this.selectedNacionalidad = null;
    this.selectedAsesor = null;
    this.filteredNacionalidades = [];
    this.filteredAsesores = [];

    if (isEdit && formData) {
      this.formAdd.patchValue(formData);
      this.selectedNacionalidad = this.nacionalidades.find(
        (n) => n.id === formData.idNacionalidad
      );
      this.suscripciones.push(
        this._globalService.GetId("personas/asesor", formData.id).subscribe({
          next: (asesor: any) => {
            this.selectedAsesor = asesor?.usuario || null;
            this.lastSelectedAsesor = this.selectedAsesor;
            //console.log("Asesor seleccionado: ", this.selectedAsesor);
          },
          error: (error: any) => {
            console.error("Error al obtener información del asesor:", error);
          },
        })
      );
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
    // //console.log("Información del cliente:", data);
    this.element = data;
    this.modalSelected = this.modalViewInfo;
    this.isModalOpen = true;
  }

  async onDeleteButtonClicked(data: any) {
    //console.log("Eliminar cliente Obtenido:", data);
    try {
      await this.showLoader("Eliminando cliente");
      await firstValueFrom(this._globalService.Delete("personas", data.id));
      await this.getCountElements();
      this.handleOperationSuccess("Cliente eliminado correctamente");
    } catch (error) {
      this.handleOperationError("Error al eliminar el cliente", error);
    }
  }

  async handleSaveX(data: any) {
    //console.log("Datos del cliente antes guardar:", data);
  }

  async handleSave(data: any) {
    const operation = this.isEdit ? "edit" : "create";
    if (!this.isEdit) delete data.id;
    await this.handleUserOperation(operation, data);
  }

  async handleUserOperation(operation: "edit" | "create", data: any) {
    try {
      data = this.prepareData(data);
      const operationText = operation === "edit" ? "Editado" : "Guardado";
      await this.showLoader(`${operationText} cliente`);

      const response = await this.performApiCall(operation, data);
      //console.log(`Cliente ${operationText.toLowerCase()}:`, data);

      if (operation === "create") {
        await this.handleAsesorCreation(response.id);
      } else {
        await this.handleAsesorUpdate(data.id);
      }

      this.handleOperationSuccess(
        `Cliente ${operationText.toLowerCase()} correctamente`
      );
    } catch (error) {
      this.handleOperationError(
        `Error al ${operation === "edit" ? "editar" : "guardar"} el cliente`,
        error
      );
    }
  }

  private prepareData(data: any) {
    data.fechaIngreso = new Date(data.fechaIngreso);
    data.email = data.email || "no-email@example.com";
    data.dni = data.dni.replace(/-/g, "");
    data.cel = data.cel.replace(/-/g, "");
    data.idNacionalidad = this.selectedNacionalidad.id;
    //console.log("Datos del cliente antes de guardar:", data);

    return data;
  }

  private async performApiCall(operation: string, data: any): Promise<any> {
    //console.log("Data a guardar performApicall: ", data);
    return operation === "edit"
      ? await firstValueFrom(
          this._globalService.PutId("personas", data.id, data)
        )
      : await firstValueFrom(this._globalService.Post("personas", data));
  }

  private async handleAsesorCreation(clienteId: number) {
    if (this.selectedAsesor) {
      await firstValueFrom(
        this._globalService.Post("personas/asesor", {
          usuarioId: this.selectedAsesor.id,
          clienteId: clienteId,
        })
      );
    }
  }

  private async handleAsesorUpdate(clienteId: number) {
    if (this.selectedAsesor) {
      //console.log("Actualizando asesor del cliente:", this.selectedAsesor);
      await firstValueFrom(
        this._globalService.PutId("personas/asesor", clienteId, {
          usuarioId: this.selectedAsesor.id,
          clienteId: clienteId,
        })
      );
    } else {
      if (this.lastSelectedAsesor) {
        await firstValueFrom(
          this._globalService.Delete("personas/asesor", clienteId)
        );
      }
    }
  }

  private async showLoader(text: string) {
    this.textLoader = text;
    this._loaderService.show();
  }

  private handleOperationSuccess(message: string) {
    this.isModalOpen = false;
    this._loaderService.hide();
    this.toastColor = "success";
    this.toastMessage = message;
    this.setOpenedToast(true);
    this.cleanForm();
    this.getCountElements();
  }

  private handleOperationError(message: string, error: any) {
    console.error(message, error);
    this._loaderService.hide();
    this.toastColor = "danger";
    this.toastMessage = message;
    this.setOpenedToast(true);
  }

  async onPageChange(event: any) {
    //console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    await this.getElementsPag();
  }

  async onSearchData(event: any): Promise<void> {
    //console.log("Evento de búsqueda:", event);
    try {
      if (event === "") {
        await this.getCountElements();
      } else {
        await firstValueFrom(
          this._globalService
            .Get(`personas/${this.action}/search?query=${event}`)
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

  private getElementsPag(): Promise<any> {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    return firstValueFrom(
      this._globalService
        .Get(`personas/${this.action}/paginated?skip=${skip}&limit=${limit}`)
        .pipe(
          tap((response: any) => {
            //console.log("Elementos obtenidos:", response);
            this.elements = response; // Asumiendo que la respuesta tiene una propiedad 'data'
          }),
          catchError((error) => {
            console.error("Error al obtener los elementos:", error);
            throw error;
          })
        )
    );
  }

  private getCountElements(): Promise<void> {
    return firstValueFrom(
      this._globalService.Get("personas/count").pipe(
        tap((response: any) => {
          //console.log("Cantidad de elementos:", response.count);
          const totalElements = response.count;
          this.totalPages = Math.ceil(totalElements / this.currentPageSize);
          //console.log("Total de páginas:", this.totalPages);
        }),
        catchError((error) => {
          console.error("Error al obtener la cantidad de elementos:", error);
          throw error;
        })
      )
    ).then(() => this.getElementsPag());
  }
}
