import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-report-estado-cuenta",
  templateUrl: "./report-estado-cuenta.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportEstadoCuentaComponent implements OnInit {
  @Input() company: string = "Company N/D";

  dateNow: Date = new Date();

  elements: any[] = [];
  saldosVigentes: any[] = [];
  totalClients = 0;
  totalMora = 0;

  isPrint = false;

  @Input() currentUser: any;

  selectedCliente: any = null;

  private _globalService = inject(GlobalService);
  constructor() {}

  ngOnInit(): void {
    this.getEstadoCuenta();
  }
  subtractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
  }

  async getEstadoCuenta() {
    this.totalClients = 0;
    this.totalMora = 0;
    await this.fetchEstadoCuenta();
  }

  private fetchEstadoCuenta(): Promise<any> {
    return firstValueFrom(
      this._globalService
        .Get(`prestamos/reporte-estado-cuenta?idCliente=${this.selectedCliente.id}`)
        .pipe(
          tap((data: any) => {
            console.log("Prestamos con mora:", data);
            this.elements = data;
            this.totalClients = this.elements.length;
            this.elements.forEach((prestamo) => {
              this.totalMora = this.totalMora + prestamo.montoMora;
            });
          }),
          catchError((error) => {
            console.error("Error fetching prestamo:", error);
            throw error;
          })
        )
    );
  }

}
