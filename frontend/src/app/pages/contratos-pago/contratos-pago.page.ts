import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom, Observable } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { ContratosPago } from "src/app/shared/interfaces/contrato";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { FieldAliases, ModalConfig } from "src/app/shared/utils/extra";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-contratos-pago",
  templateUrl: "./contratos-pago.page.html",
  styleUrls: ["./contratos-pago.page.scss"],
})
export class ContratosPagoPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  elements: ContratosPago[] = [];

  element: ContratosPago = {
    correlativo: "",
    fechaGeneracion: "",
    contenido: "",
    idPrestamo: 0,
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
  toastColor: string = "primary";
  toastMessage: string = "cliente guardado correctamente";
  title: string = "Todos";
  action: string = "todos";

  @ViewChild("modalAdd", { static: true }) modalAdd!: TemplateRef<any>;
  @ViewChild("modalViewInfo", { static: true })
  modalViewInfo!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAdd;
  modalConfig: ModalConfig = { fieldAliases: {} };
  formSelected: FormGroup;

  private _router = inject(Router);
  private _globalService = inject(GlobalService);

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.formAdd = this.formModels.personasForm();
    this.formSelected = this.formAdd;
    // //console.log("Formulario de cliente:", this.formAdd);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getCountElements();
    this.buildColumns();
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
        key: "correlativo",
        alias: "Código",
      },
      {
        key: "fechaGeneracion",
        alias: "Fecha Generación",
        type: "date",
      },
      {
        key: "contenido",
        alias: "Contenido",
        type: "xml",
      },
      {
        key: "prestamo.cliente.nombres",
        alias: "Cliente",
        combineWith: "prestamo.cliente.apellidos",
        combineFormat: (nombres, apellidos) => `${nombres} ${apellidos}`,
      },
      {
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Ver",
            action: "go",
            icon: "open",
            color: "primary",
            rolesAuthorized: [1, 2],
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
    //console.log("Form Data:", formData);

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
    // //console.log("Información del cliente:", data);
    this.element = data;
    this.modalSelected = this.modalViewInfo;
    this.isModalOpen = true;
  }
  onGoButtonClicked(data: any) {
    //console.log("Ir al detalle del cliente:", data.idPrestamoEncrypted);
    //Redirigir al detalle del cliente

    // return;
    this._router.navigate(["/layout/gestion-contrato", data.idPrestamoEncrypted]);
  }

  onDeleteButtonClicked(data: any) {
    //console.log("Eliminar cliente Obtenido:", data);
    this.textLoader = "Eliminando cliente";
    this.loaderComponent.show();
    
    firstValueFrom(
      this._globalService.Delete("personas", data.id)
    ).then((response: any) => {
      //console.log("cliente eliminado:", response);
      this.getCountElements();
      this.loaderComponent.hide();
      this.toastMessage = "cliente eliminado correctamente";
      this.setOpenedToast(true);
    }).catch((error: any) => {
      console.error("Error al eliminar el cliente:", error);
      this.loaderComponent.hide();
      this.toastMessage = "Error al eliminar el cliente";
      this.setOpenedToast(true);
    });
  }

  handleUserOperation(operation: "edit" | "create", data: any) {
    data.fechaIngreso = new Date(data.fechaIngreso);
    //console.log("Datos del cliente:", data);
  
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
  
    firstValueFrom(apiCall).then(() => {
      //console.log(`cliente ${operationText.toLowerCase()}:`, response);
      this.isModalOpen = false;
      this.loaderComponent.hide();
      this.toastMessage = `cliente ${operationText.toLowerCase()} correctamente`;
      this.setOpenedToast(true);
      this.cleanForm();
      this.getCountElements();
    }).catch((error: any) => {
      console.error(
        `Error al ${operationText.toLowerCase()} el cliente:`,
        error
      );
      this.loaderComponent.hide();
      this.toastMessage = `Error al ${operationText.toLowerCase()} el cliente`;
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
    //console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    this.getElementsPag();
  }

  onSearchData(event: any) {
    //console.log("Evento de búsqueda:", event);
    if (event === "") {
      this.getCountElements();
    } else {
      firstValueFrom(
        this._globalService.Get(`contratos-pagos/search?query=${event}`)
      ).then((response: any) => {
        this.elements = response;
        // console.log("Elementos obtenidos Search:", response);
      }).catch((error) => {
        console.error("Error al obtener los elementos:", error);
      });
    }
  }

  getElementsPag() {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;
  
    firstValueFrom(
      this._globalService.Get(`contratos-pagos/paginated?skip=${skip}&limit=${limit}`)
    ).then((response: any) => {
      this.elements = response;
      // console.log("Elementos obtenidos Paginate:", response);
    }).catch((error) => {
      console.error("Error al obtener los elementos:", error);
    });
  }

  getCountElements() {
    firstValueFrom(
      this._globalService.Get("contratos-pagos/count")
    ).then((response: any) => {
      //console.log("Cantidad de elementos:", response.count);
      const totalElements = response.count;
      this.totalPages = Math.ceil(totalElements / this.currentPageSize);
      //console.log("Total de páginas:", this.totalPages);
      this.getElementsPag();
    }).catch((error) => {
      console.error("Error al obtener la cantidad de elementos:", error);
    });
  }
}
