import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgxPrintService, PrintOptions } from "ngx-print";
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  Subject,
  Subscription,
  switchMap,
} from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { GlobalService } from "src/app/shared/services/global.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { environment } from "src/environments/environment";
import { ReportCarteraAsesoresComponent } from "./report-cartera-asesores/report-cartera-asesores.component";
import { ReportClientsMoraComponent } from "./report-clients-mora/report-clients-mora.component";
import { ReportRecordCrediticioComponent } from "./report-record-crediticio/report-record-crediticio.component";
import { ReportEstadoCuentaComponent } from "./report-estado-cuenta/report-estado-cuenta.component";

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

  searchClient: string = "";
  searchAsesor: string = "";
  private searchAsesores$ = new Subject<string>();
  private searchClientes$ = new Subject<string>();

  @ViewChild("modalAsesorSelector")
  modalAsesorSelector!: TemplateRef<any>;

  @ViewChild(ReportCarteraAsesoresComponent)
  reportCarteraAsesor!: ReportCarteraAsesoresComponent;

  @ViewChild(ReportClientsMoraComponent)
  reportClientsMoraComponent!: ReportClientsMoraComponent;

  @ViewChild(ReportEstadoCuentaComponent)
  reportEstadoCuentaComponent!: ReportEstadoCuentaComponent;

  @ViewChild(ReportRecordCrediticioComponent)
  reportRecordCrediticioComponent!: ReportRecordCrediticioComponent;

  @ViewChild("modalClienteSelector")
  modalClienteSelector!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAsesorSelector;

  filteredAsesores: any[] = [];
  filteredClientes: any[] = [];
  selectedAsesor: any = null;
  selectedCliente: any = null;
  currentUser: any = null;

  private subscription: Subscription = new Subscription();

  private _globalService = inject(GlobalService);
  private _printService = inject(NgxPrintService);
  private _authService = inject(AuthService);
  private _loaderService = inject(LoaderService);
  constructor() {}

  ngOnInit() {
    this.company = environment.company;
    this.getCurrentUser();
    this.initSearcher();
  }

  ngOnDestroy() {
    this.searchClientes$.complete();
    this.searchAsesores$.complete();
    this.subscription.unsubscribe();
  }
  scrollToElement(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  initSearcher() {
    this.searchClientes$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        if (this.searchClient.trim() === "") {
          this.filteredClientes = [];
        } else {
          this.searchDataClients();
        }
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });

    this.searchAsesores$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        if (this.searchAsesor.trim() === "") {
          this.filteredAsesores = [];
        } else {
          this.searchDataUsers();
        }
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });
  }

  searchValueChanged(event: any, type: string) {
    //console.log("Search value changed:", event.target.value, type);
    switch (type) {
      case "cliente":
        this.searchClientes$.next(event.target.value);
        break;
      case "asesor":
        this.searchAsesores$.next(event.target.value);
        break;
    }
  }

  searchDataClients() {
    const idUser = this.currentUser?.id;
    firstValueFrom(
      this._globalService.Get(
        `personas/clientes/search/${idUser}?query=${this.searchClient}`
      )
    )
      .then((data: any) => {
        console.log(`Clientes encontrados para ${this.searchClient}:`, data);
        this.filteredClientes = data;
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
  }

  searchDataUsers() {
    firstValueFrom(
      this._globalService.Get(
        `usuarios/asesores/search?query=${this.searchAsesor}`
      )
    )
      .then((data: any) => {
        //console.log(`Asesores encontrados para ${this.searchAsesor}:`, data);
        this.filteredAsesores = data;
      })
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
      });
  }

  getCurrentUser() {
    // firstValueFrom(this._authService.getUserInfo()).then((user) => {
    //   this.currentUser = user;
    //   if (user?.rolid === 3) {
    //     this.selectedAsesor = user;
    //     //console.log("User es asesor:", user);
    //   }
    // });
    this.subscription.unsubscribe();

    this.subscription = this._authService.getUserInfo().subscribe((user) => {
      this.currentUser = user;
      if (user?.rolid === 3) {
        this.selectedAsesor = user;
        //console.log("User es asesor:", user);
      }
    });
  }

  clearFilters() {
    this.filteredAsesores = [];
    this.filteredClientes = [];
    this.selectedAsesor = null;
    this.selectedCliente = null;
    this.reporteSeleccionado = null;

    this.obtenerReporte();
  }

  obtenerReporte() {
    switch (this.reporteSeleccionado) {
      case "clientes-mora":
        this.reportClientsMoraComponent.getForAsesor(this.selectedAsesor);
        break;
      case "estado-cuenta":
        this.reportEstadoCuentaComponent.getForCliente(this.selectedCliente);

        break;
      case "record-crediticio":
        this.reportRecordCrediticioComponent.getForCliente(
          this.selectedCliente
        );

        break;
      case "cartera-asesor":
        if (this.currentUser?.rolid === 3) {
          this.selectedAsesor = this.currentUser;
        }
        this.reportCarteraAsesor.getCarteraAsesor(this.selectedAsesor);

        break;
      default:
        break;
    }

    this.scrollToElement("current-report");
  }
  handleSave(event: any) {
    //console.log("Event:", event);
  }

  showOpenModal(value: boolean, type: string) {
    this.searchClient = "";
    this.searchAsesor = "";
    this.filteredAsesores = [];
    this.filteredClientes = [];
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
        if (this.currentUser?.rolid === 3) {
          setTimeout(() => {
            this.selectAsesor(this.currentUser);
          }, 2000);
        }
        break;
    }

    // this.scrollToElement("current-report");
  }

  selectAsesor(asesor: any) {
    this.selectedAsesor = asesor;
    //console.log("Asesor seleccionada: ", this.selectedAsesor);
    this.isModalOpen = false;

    this.obtenerReporte();
  }
  selectCliente(cliente: any) {
    this.selectedCliente = cliente;
    //console.log("Cliente seleccionada: ", this.selectedCliente);
    this.isModalOpen = false;

    this.obtenerReporte();
  }

  printSection() {
    this.isPrint = true;
    this.textLoader = "Imprimiendo...";
    this._loaderService.show();
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: "report-print",
      printTitle:
        this.reporteSeleccionado + "-" + new Date().toLocaleDateString(),
      // Add any other print options as needed
    });
    this._printService.styleSheetFile = "assets/css/print.css";

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
