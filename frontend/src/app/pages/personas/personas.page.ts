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
import { Personas } from "src/app/shared/interfaces/persona";
import { Column } from "src/app/shared/interfaces/table";
import { Usuario } from "src/app/shared/interfaces/usuario";
import { AuthService } from "src/app/shared/services/auth.service";
import { GlobalService } from "src/app/shared/services/global.service";
import { FieldAliases, ModalConfig } from "src/app/shared/utils/extra";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-clientes",
  templateUrl: "./personas.page.html",
  styleUrls: ["./personas.page.scss"],
})
export class PersonasPage implements OnInit {
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
  isModalOpenX = false;
  isToastOpen = false;
  isEdit = false;

  textLoader: string = "Cargando...";
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

  private _router = inject(Router);
  private _globalService = inject(GlobalService);
  private _authService = inject(AuthService);

  //TODO: ESPECIFICOS
  nacionalidades: any[] = [];
  asesores: any[] = [];
  recordsCrediticios: any[] = [];
  estadosCiviles: any[] = [];
  tiposPersona: any[] = [];

  currentUser: Usuario | null = null;

  filteredNacionalidades = this.nacionalidades;
  selectedNacionalidad: any = null;
  filteredAsesores = this.asesores;
  selectedAsesor: any = null;

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.personasForm();
    this.formSelected = this.formAdd;
    this.formSelectedX = this.formAdd;
    // console.log("Formulario de cliente:", this.formAdd);
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
    console.log("Nacionalidad seleccionada: ", this.selectedNacionalidad);
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
    console.log("Asesor seleccionada: ", this.selectedAsesor);
    this.isModalOpenX = false;
  }

  getCurrentUser() {
    this._authService.getUserInfo().subscribe({
      next: (user: any) => {
        this.currentUser = user;
        console.log("Usuario actual: ", this.currentUser);
      },
      error: (error: any) => {
        console.error("Error al obtener información del usuario:", error);
      },
    });
    console.log("Usuario actual: ", this.currentUser);
  }

  //TODO: ESPECIFICO
  goAction(action: string) {
    // console.log("Accion capturada: ", action);
    this.title = action;
    this.action = action.toLowerCase();
    this.getCountElements();
  }

  //TODO: ESPECIFICO
  cargarOpciones() {
    this._globalService.Get("nacionalidades").subscribe((data: any) => {
      this.nacionalidades = data;
      // console.log(this.nacionalidades);
    });
    this._globalService.GetId("usuarios/roles", 3).subscribe((data: any) => {
      this.asesores = data;
      console.log("Asesores: ", this.asesores);
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

  private setModalState(isEdit: boolean, modalTemplate: any, formData?: any) {
    this.isEdit = isEdit;

    if (formData) {
      formData = this._globalService.parseObjectDates(formData);
    }
    console.log("Form Data:", formData);

    this.selectedNacionalidad = null;
    this.selectedAsesor = null;
    this.filteredNacionalidades = [];
    this.filteredAsesores = [];

    if (isEdit && formData) {
      this.formAdd.patchValue(formData);
      this.selectedNacionalidad = this.nacionalidades.find(
        (n) => n.id === formData.idNacionalidad
      );
      this._globalService.GetId("personas/asesor", formData.id).subscribe({
        next: (asesor: any) => {
          this.selectedAsesor = asesor?.Usuario || null;
          console.log("Asesor seleccionado: ", this.selectedAsesor);
        },
        error: (error: any) => {
          console.error("Error al obtener información del asesor:", error);
        },
      });
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

  async handleSaveX(data: any) {
    console.log("Datos del cliente antes guardar:", data);
  }

  async handleSave(data: any) {
    if (data.email === "" || data.email === null) {
      data.email = "no-email@example.com";
    }

    //Eliminar guiones de cadena de data.dni y data.cel
    data.dni = data.dni.replace(/-/g, "");
    data.cel = data.cel.replace(/-/g, "");
    data.idNacionalidad = this.selectedNacionalidad.id;

    console.log("Datos del cliente antes guardar:", data);

    if (this.isEdit) {
      this.handleUserOperation("edit", data);
      
    } else if (!this.isEdit) {
      delete data.id;
      this.handleUserOperation("create", data);
    }
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
        if (this.selectedAsesor && operation==='create') {
          this._globalService
            .Post("personas/asesor", {
              usuarioId: this.selectedAsesor.id,
              clienteId: response.id,
            })
            .subscribe({
              next: (response: any) => {
                console.log("Asesor guardado:", response);
                this.isModalOpen = false;
                this.loaderComponent.hide();
                this.toastColor = "success";
                this.toastMessage = `cliente ${operationText.toLowerCase()} correctamente`;
                this.setOpenedToast(true);
                this.cleanForm();
                this.getCountElements();
              },
              error: (error: any) => {
                console.error("Error al guardar el asesor:", error);
                this.toastColor = "danger";
                this.toastMessage = `Error al guardar el asesor`;
                this.setOpenedToast(true);
              },
            });
        }

        if (this.selectedAsesor && operation === 'edit') {
          this._globalService.PutId('personas/asesor', data.id, {
            usuarioId: this.selectedAsesor.id,
            clienteId: data.id,
          }).subscribe({
            next: (response: any) => {
              console.log("Asesor actualizado:", response);
              this.isModalOpen = false;
              this.loaderComponent.hide();
              this.toastColor = "success";
              this.toastMessage = `cliente ${operationText.toLowerCase()} correctamente`;
              this.setOpenedToast(true);
              this.cleanForm();
              this.getCountElements();
            },
            error: (error: any) => {
              console.error("Error al actualizar el asesor:", error);
              this.loaderComponent.hide();
              this.toastColor = "danger";
              this.toastMessage = `Error al actualizar el asesor`;
              this.setOpenedToast(true);
            },
          })
        } else {
          this._globalService.Delete("personas/asesor", data.id).subscribe({
            next: (response: any) => {
              console.log("Asesor eliminado:", response);
              this.isModalOpen = false;
              this.loaderComponent.hide();
              this.toastColor = "success";
              this.toastMessage = `cliente ${operationText.toLowerCase()} correctamente`;
              this.setOpenedToast(true);
              this.cleanForm();
              this.getCountElements();
            },
            error: (error: any) => {
              console.error("Error al eliminar el asesor:", error);
              this.toastColor = "danger";
              this.toastMessage = `Error al eliminar el asesor`;
              this.setOpenedToast(true);
            },
          });
        }

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
