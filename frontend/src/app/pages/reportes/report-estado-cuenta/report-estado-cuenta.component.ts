import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import { GlobalService } from "src/app/shared/services/global.service";
import { environment } from "src/environments/environment";
const TASA_MORA = environment.percentage * 100;
@Component({
  selector: "app-report-estado-cuenta",
  templateUrl: "./report-estado-cuenta.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportEstadoCuentaComponent implements OnInit {
  @Input() company: string = "Company N/D";
  tasaMora = TASA_MORA;

  dateNow: Date = new Date();

  elements: any[] = [];
  saldosVigentes: any[] = [];

  isPrint = false;

  @Input() currentUser: any;

  selectedCliente: any = null;

  private _globalService = inject(GlobalService);
  constructor() {}

  ngOnInit(): void {
    this.getForCliente(this.selectedCliente);
  }
  subtractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
  }

  getForCliente(cliente: any) {
    this.selectedCliente = cliente;
    if (cliente) {
      this.getEstadoCuenta();
    }
  }

  async getEstadoCuenta() {
    await this.fetchEstadoCuenta();
  }

  private fetchEstadoCuenta(): Promise<any> {
    return firstValueFrom(
      this._globalService
        .Get(
          `prestamos/reporte-estado-cuenta?idCliente=${this.selectedCliente.id}`
        )
        .pipe(
          tap((data: any) => {
            console.log("Prestamos con mora:", data);
            this.elements = data;
          }),
          catchError((error) => {
            console.error("Error fetching prestamo:", error);
            throw error;
          })
        )
    );
  }
}
