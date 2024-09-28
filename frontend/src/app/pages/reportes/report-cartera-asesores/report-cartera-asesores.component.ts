import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import { Cartera } from "src/app/shared/interfaces/report-cartera";
import { EncabezadoCarteraAsesor } from "src/app/shared/interfaces/reporte-cartera-asesor";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-report-cartera-asesores",
  templateUrl: "./report-cartera-asesores.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportCarteraAsesoresComponent implements OnInit {
  @Input() company: string = "";
  @Input() selectedAsesor: any = null;

  carteraAsesor: Cartera[] = [];
  dateNow: Date = new Date();

  encabezado: EncabezadoCarteraAsesor = {
    montoOtorgado: 0,
    saldoCapitalActual: 0,
    saldoActual: 0,
    valorCuota: 0,
    tasaPromedio: 0,
    valorTotalPagar: 0,
    valorCuotasAtrasada: 0,
    mora: 0,
    totalConMora: 0,
  };

  private _globalService = inject(GlobalService);
  constructor() {}

  ngOnInit(): void {
    this.getCarteraAsesor(this.selectedAsesor);
  }

  subtractHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
  }


  async getCarteraAsesor(asesor: any) {
    // prestamos/reporte-cartera-asesor?idUsuario=4

    if (!asesor) return;
    this.selectedAsesor = asesor;
    await this.fetchCartera();
  }

  private fetchCartera(): Promise<any> {
    return firstValueFrom(
      this._globalService
        .Get(
          `prestamos/reporte-cartera-asesor?idUsuario=${this.selectedAsesor.id}`
        )
        .pipe(
          tap((cartera: any) => {
            //console.log("Cartera asesor:", cartera);
            this.carteraAsesor = cartera;

            const initialEncabezado = {
              montoOtorgado: 0,
              saldoCapitalActual: 0,
              saldoActual: 0,
              valorCuota: 0,
              tasaPromedio: 0,
              valorTotalPagar: 0,
              valorCuotasAtrasada: 0,
              mora: 0,
              totalConMora: 0,
            };

            this.encabezado = cartera.reduce(
              (acc: any, item: any) => ({
                montoOtorgado: acc.montoOtorgado + item.montoOtorgado,
                saldoCapitalActual:
                  acc.saldoCapitalActual + item.saldoCapitalActual,
                saldoActual: acc.saldoActual + item.saldoActual,
                valorCuota: acc.valorCuota + item.valorCuota,
                tasaPromedio: acc.tasaPromedio + item.tasa,
                valorTotalPagar: acc.valorTotalPagar + item.valorTotal,
                valorCuotasAtrasada:
                  acc.valorCuotasAtrasada + item.valorCuotasAtrasadas,
                mora: acc.mora + item.mora,
                totalConMora: 0, // We'll calculate this after the reduce
              }),
              initialEncabezado
            );

            // Calculate average rate and total with late fees
            this.encabezado.tasaPromedio /= cartera.length;
            this.encabezado.totalConMora =
              this.encabezado.montoOtorgado + this.encabezado.mora;
          }),
          catchError((error) => {
            console.error("Error fetching prestamo:", error);
            throw error;
          })
        )
    );
  }
}
