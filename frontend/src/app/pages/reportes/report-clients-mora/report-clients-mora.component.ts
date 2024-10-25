import {
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { catchError, firstValueFrom, Subscription, tap } from "rxjs";
import { ClienteMora } from "src/app/shared/interfaces/report-mora";
import { AuthService } from "src/app/shared/services/auth.service";
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

  elements: ClienteMora[] = [];
  totalClients = 0;
  totalMora = 0;

  isPrint = false;

  @Input() currentUser: any;
  idUser: number = 0;

  asesorSelected: any = null;

  private _globalService = inject(GlobalService);
  constructor() {
    
  }

  ngOnInit(): void {
    this.idUser = this.currentUser.id;
          this.getPrestamosWithMora();
  }
  subtractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
  }
  getForAsesor(asesor: any) {
    this.asesorSelected = asesor;
    if (asesor) {
      this.idUser = asesor.id;
    } else {
      this.idUser = this.currentUser.id;
    }

    this.getPrestamosWithMora();
  }

  async getPrestamosWithMora() {
    this.totalClients = 0;
    this.totalMora = 0;
    await this.fetchPrestamos();
  }

  private fetchPrestamos(): Promise<any> {
    return firstValueFrom(
      this._globalService
        .Get(`prestamos/reporte-mora?idUsuario=${this.idUser}`)
        .pipe(
          tap((data: any) => {
            //console.log("Prestamos con mora:", data);
            this.elements = data;
            // this.totalClients = this.elements.length;

            this.elements.forEach((prestamo) => {
              this.totalMora = this.totalMora + prestamo.montoMora;
              
            });

            const uniqueClients = new Set(this.elements.map(prestamo => prestamo.codCliente));
            this.totalClients = uniqueClients.size;
            

          }),
          catchError((error) => {
            console.error("Error fetching prestamo:", error);
            throw error;
          })
        )
    );
  }
  
}
