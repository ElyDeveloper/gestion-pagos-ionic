import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgxPrintService, PrintOptions } from "ngx-print";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { GlobalService } from "src/app/shared/services/global.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { environment } from "src/environments/environment";
import { ReportCarteraAsesoresComponent } from "./report-cartera-asesores/report-cartera-asesores.component";
import { ReportClientsMoraComponent } from "./report-clients-mora/report-clients-mora.component";
import { ReportRecordCrediticioComponent } from "./report-record-crediticio/report-record-crediticio.component";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.page.html",
  styleUrls: ["./reportes.page.scss"],
})
export class ReportesPage implements OnInit {
  company: string = "Company N/D";

  isPrint = false;
  isToastOpen = false;
  loading = true;
  enableFilterAsesor = false;
  enableFilterCliente = false;

  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  textLoader: string = "primary";

  reporteSeleccionado: string | null = null;
  isModalOpen = false;

  @ViewChild("modalAsesorSelector")
  modalAsesorSelector!: TemplateRef<any>;

  @ViewChild(ReportCarteraAsesoresComponent)
  reportCarteraAsesor!: ReportCarteraAsesoresComponent;

  @ViewChild(ReportClientsMoraComponent)
  reportClientsMoraComponent!: ReportClientsMoraComponent;

  @ViewChild(ReportRecordCrediticioComponent)
  reportRecordCrediticioComponent!: ReportRecordCrediticioComponent;

  @ViewChild("modalClienteSelector")
  modalClienteSelector!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAsesorSelector;

  asesores: any[] = [];
  clientes: any[] = [];
  filteredAsesores = this.asesores;
  filteredClientes = this.clientes;
  selectedAsesor: any = null;
  selectedCliente: any = null;
  currentUser: any = null;

  private suscriptions: Subscription[] = [];

  private _globalService = inject(GlobalService);
  private _printService = inject(NgxPrintService);
  private _authService = inject(AuthService);
  private _loaderService = inject(LoaderService);
  constructor() {}

  ngOnInit() {
    this.company = environment.company;
    this.getCurrentUser();
    this.getAsesores();
  }

  ionViewDidLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
  }

  getCurrentUser() {
    this.suscriptions.push(
      this._authService.getUserInfo().subscribe((user) => {
        this.currentUser = user;
      })
    );
  }

  clearFilters() {
    this.filteredAsesores = [];
    this.filteredClientes = [];
    this.selectedAsesor = null;
    this.selectedCliente = null;

    this.obtenerReporte();
  }

  obtenerReporte() {
    switch (this.reporteSeleccionado) {
      case "clientes-mora":
        this.reportClientsMoraComponent.getForAsesor(this.selectedAsesor);
        break;
      case "estado-cuenta":
        // this.reportClientsMoraComponent.getEstadosCuentas();
        break;
      case "record-crediticio":
        this.reportRecordCrediticioComponent.getForCliente(
          this.selectedCliente
        );
        break;
      case "cartera-asesor":
        this.reportCarteraAsesor.getCarteraAsesor();
        break;
      default:
        break;
    }
  }
  handleSave(event: any) {
    console.log("Event:", event);
  }

  showOpenModal(value: boolean, type: string) {
    switch (type) {
      case "asesor":
        this.selectedAsesor = null;
        this.selectedCliente = null;
        this.modalSelected = this.modalAsesorSelector;
        break;
      case "cliente":
        this.selectedAsesor = null;
        this.selectedCliente = null;
        this.modalSelected = this.modalClienteSelector;
        break;
      default:
        break;
    }

    this.isModalOpen = value;
  }

  seleccionarReporte(tipo: string) {
    this.reporteSeleccionado = tipo;

    this.enableFilterAsesor = false;
    this.enableFilterCliente = false;

    switch (tipo) {
      case "clientes-mora":
        this.enableFilterAsesor = true;
        break;
      case "estado-cuenta":
        this.enableFilterCliente = true;
        break;
      case "record-crediticio":
        this.enableFilterCliente = true;
        break;
      case "cartera-asesor":
        this.enableFilterAsesor = true;
        break;
    }
  }

  getAsesores() {
    this.suscriptions.push(
      this._globalService.GetId("usuarios/roles", 3).subscribe((data: any) => {
        this.asesores = data;
        console.log("Asesores: ", this.asesores);
      })
    );
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
  filterClientes(event: any) {
    console.log("Event: ", event);
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm === "") {
      this.filteredClientes = [];
      return;
    }

    this.suscriptions.push(
      this._globalService
        .Get(`personas/clientes/search?query=${event}`)
        .subscribe({
          next: (response: any) => {
            this.filteredClientes = response;
            console.log("Elementos obtenidos:", response);
          },
          error: (error) => {
            console.error("Error al obtener los elementos:", error);
          },
        })
    );
  }

  selectAsesor(asesor: any) {
    this.selectedAsesor = asesor;
    console.log("Asesor seleccionada: ", this.selectedAsesor);
    this.isModalOpen = false;

    this.obtenerReporte();
  }
  selectCliente(cliente: any) {
    this.selectedCliente = cliente;
    console.log("Cliente seleccionada: ", this.selectedCliente);
    this.isModalOpen = false;

    this.obtenerReporte();
  }

  printSection() {
    this.isPrint = true;
    this.textLoader = "Imprimiendo...";
    this._loaderService.show();
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: "report-print",

      // Add any other print options as needed
    });
    this._printService.styleSheetFile = "assets/css/print.css";

    //eliminar elemento         key: "actions", del objeto columnsData

    //esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this._printService.print(customPrintOptions);

      //Volver a colocar la columna actions

      this.isPrint = false;
      this._loaderService.hide();
    }, 1000);
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }
}
