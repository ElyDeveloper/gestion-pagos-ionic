import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import {
  EncabezadoEstadoCuenta,
  PagosEfectuados,
  SaldoEstadoCuenta,
} from "src/app/shared/interfaces/report-estado-cuenta";
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

  encabezado: EncabezadoEstadoCuenta = {
    nroPrestamo: "N/A",
    codClientes: "N/A",
    estadoPtmo: false,
    mtoPrestamo: 0,
    saldoPtmo: 0,
    SaldoTotPtmo: 0,
    asesor: "N/A",
    nombreAsesor: "N/A",
    tMora: "N/A",
    fDesembolso: "N/A",
    producto: "N/A",
    cuota: 0,
    plazo: "N/A",
    Periodo: "N/A",
    direccion: "N/A",
    telefono: "N/A",
    mora: 0,
    totalSTotales: 0,
  };

  pagosEfectuados: PagosEfectuados[] = [];
  saldosVigentes: SaldoEstadoCuenta[] = [];
  saldosPagarAtrasados: SaldoEstadoCuenta[] = [];

  isPrint = false;

  @Input() currentUser: any;

  @Input() selectedCliente: any = null;

  private _globalService = inject(GlobalService);
  constructor() {}

  ngOnInit(): void {
    this.getForCliente(this.selectedCliente);
  }

  calculateTotalSaldosVigentes(property: keyof SaldoEstadoCuenta): number {
    return this.saldosVigentes.reduce((accumulator, current) => {
      return accumulator + ((current[property] as number) || 0);
    }, 0);
  }

  calculateTotalPagarAtrasados(property: keyof SaldoEstadoCuenta): number {
    return this.saldosPagarAtrasados.reduce((accumulator, current) => {
      return accumulator + ((current[property] as number) || 0);
    }, 0);
  }

  calculateTotalPagosEfectuados(property: keyof PagosEfectuados): number {
    return this.pagosEfectuados.reduce((accumulator, current) => {
      return accumulator + ((current[property] as number) || 0);
    }, 0);
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
            console.log("Estado de cuenta:", data);

            if (data.encabezados.length > 0) {
              this.encabezado = data.encabezados[0];
            }
            this.saldosVigentes = data.saldoVigente;
            this.pagosEfectuados = data.pagosEfectuados;
            this.saldosPagarAtrasados = data.saldosPagarAtrasados;

            let counter = 1;
            // //console.log("Saldos vigentes:", this.saldosVigentes);
            this.saldosVigentes.forEach((saldo) => {
              saldo.nCuota = counter;
              counter++;
            });

            counter = 1;
            // //console.log("Saldos a pagar atrasados:", this.saldosPagarAtrasados);
            this.saldosPagarAtrasados.forEach((saldo) => {
              saldo.nCuota = counter;
              counter++;
            });

            counter = 1;
            // //console.log("Pagos efectuados:", this.pagosEfectuados);
            this.pagosEfectuados.forEach((pag) => {
              pag.nCuota = counter;
              counter++;
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
