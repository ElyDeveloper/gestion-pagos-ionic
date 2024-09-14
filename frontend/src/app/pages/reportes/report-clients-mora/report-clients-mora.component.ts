import {
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { Subscription } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { GlobalService } from "src/app/shared/services/global.service";
import { environment } from "src/environments/environment";

const PERCENTAGE = environment.percentage;
const MILLISECONDS_PER_DAY = 1000 * 3600 * 24;

@Component({
  selector: "app-report-clients-mora",
  templateUrl: "./report-clients-mora.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportClientsMoraComponent implements OnInit {
  @Input() company: string = "Company N/D";

  dateNow: Date = new Date();

  elements: any[] = [];
  totalClients = 0;
  totalMora = 0;

  isPrint = false;
  isModalOpen = false;

  asesores: any[] = [];
  filteredAsesores = this.asesores;
  selectedAsesor: any = null;

  private suscriptions: Subscription[] = [];

  @ViewChild("modalAsesorSelector")
  modalAsesorSelector!: TemplateRef<any>;

  modalSelected: TemplateRef<any> = this.modalAsesorSelector;

  uploader!: FileUploader;

  private globalService = inject(GlobalService);

  constructor() {
    this.dateNow = this.subtractHours(this.dateNow, 6);
  }

  ngOnInit(): void {
    this.getPrestamosWithMora();
  }

  handleSave(event: any) {
    console.log("Event:", event);
  }

  subtractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
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
    this.isModalOpen = false;
  }

  getPrestamosWithMora() {
    this.totalClients = 0;
    this.totalMora = 0;
    this.suscriptions.push(
      this.globalService.Get("prestamos/reporte-mora").subscribe({
        next: (data: any) => {
          console.log("Prestamos con mora:", data);
          this.elements = data;
          this.totalClients = this.elements.length;
          this.elements.forEach((prestamo) => {
            this.totalMora = this.totalMora + prestamo.montoMora;
          });
        },
        error: (error) => {
          console.error("Error obteniendo prestamos con mora:", error);
        },
      })
    );

    this.suscriptions.push(
      this.globalService.GetId("usuarios/roles", 3).subscribe((data: any) => {
        this.asesores = data;
        console.log("Asesores: ", this.asesores);
      })
    );
  }

  ionViewDidLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
  }

  showOpenModal(value: boolean) {
    this.modalSelected = this.modalAsesorSelector
    this.isModalOpen = value;
  }

  scrollToElement(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
