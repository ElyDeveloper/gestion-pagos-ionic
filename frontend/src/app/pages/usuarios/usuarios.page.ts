import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
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
  elements: Usuario[] = [];
  currentPage = 1;
  currentPageSize = 10;
  totalPages = 0;

  columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)

  form: FormGroup;
  formModels: FormModels;

  searchTerm$ = new Subject<string>();
  search: string = "";
  isModalOpen = false;

  private _globalService = inject(GlobalService);
  @ViewChild("modalContent", { static: true }) modalContent!: TemplateRef<any>;

  // TODO: Especificos
  roles: Rol[] = [];

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.form = this.formModels.usuarioForm();
  }

  ngOnInit() {
    this.initSearcher();
    this.getRoles();
    this.getCountElements();
    this.buildColumns();
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
        key: "rolid",
        alias: "Rol",
      },
      {
        key: "telefono",
        alias: "Teléfono",
      },
      {
        key: "correo",
        alias: "Correo Electrónico",
      },
      {
        key: "tipoUsuario",
        alias: "Tipo de Usuario",
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
      },
    ];
  }
  onAddButtonClicked() {
    this.isModalOpen = true;
  }

  handleSave(data: any) {
    console.log("Datos guardados:", data);
    // Aquí puedes procesar los datos como necesites
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

    this._globalService.Get(`usuarios?skip=${skip}&limit=${limit}`).subscribe({
      next: (response: any) => {
        this.elements = response;
        console.log("Elementos obtenidos:", this.elements);
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
