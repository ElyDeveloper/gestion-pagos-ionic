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

  uploader!: FileUploader;

  private suscriptions: Subscription[] = [];
  private _globalService = inject(GlobalService);
  constructor() {
    this.dateNow = this.subtractHours(this.dateNow, 6);
  }

  ngOnInit(): void {
    this.getPrestamosWithMora();
  }

  subtractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
  }

  getPrestamosWithMora() {
    this.totalClients = 0;
    this.totalMora = 0;
    this.suscriptions.push(
      this._globalService.Get("prestamos/reporte-mora").subscribe({
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
  }

  ionViewDidLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
  }

  scrollToElement(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
