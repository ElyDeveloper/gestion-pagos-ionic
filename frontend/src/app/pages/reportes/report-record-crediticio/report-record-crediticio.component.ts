import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import {
  CuerpoRecordCrediticio,
  EncabezadoRecordCrediticio,
  PieRecordCrediticio,
  PrestamoRecordCrediticio,
} from "src/app/shared/interfaces/report-record-crediticio";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-report-record-crediticio",
  templateUrl: "./report-record-crediticio.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportRecordCrediticioComponent implements OnInit {
  @Input() company: string = "Company N/D";
  @Input() selectedCliente: any = null;
  @Input() selectedAsesor: any = null;

  idCliente: number = 0;
  encabezado: EncabezadoRecordCrediticio = {
    idPrestamo: "N/A",
    cliente: "N/A",
    direccion: "N/A",
    telefono: "N/A",
    asesor: "N/A",
    producto: "N/A",
    etapa: "N/A",
    numeroTotalPtmos: "N/A",
    fechaProceso: "N/A",
    recordCrediticio: "N/A",
    cantidadDesembolso: 0,
  };
  cuerpo: CuerpoRecordCrediticio[] = [];

  // interface PrestamoRecordCrediticio {
  //   idPrestamo: number;
  //   fecha: string;
  //   plazo: string;
  //   monto: number;
  //   asesor: string;
  //   tasa: number;
  //   tipo: string;
  // }

  // export interface PieRecordCrediticio {
  //   pie: {
  //     activos: PrestamoRecordCrediticio[];
  //     completados: PrestamoRecordCrediticio[];
  //   };
  // }
  pie: PieRecordCrediticio = {
    activos: [],
    completados: [],
  };

  dateNow: Date = new Date();

  private _globalService = inject(GlobalService);

  constructor() {}

  ngOnInit() {
    this.getForCliente(this.selectedCliente);
  }

  calculateTotalDetallesPagos(property: keyof CuerpoRecordCrediticio): number {
    return this.cuerpo.reduce((accumulator, current) => {
      return accumulator + (current[property] as number || 0);
    }, 0);
  }
  calculateTotalPrestamosActivos(property: keyof PrestamoRecordCrediticio): number {
    return this.pie.activos.reduce((accumulator, current) => {
      return accumulator + (current[property] as number || 0);
    }, 0);
  }
  calculateTotalPrestamosCompletados(property: keyof PrestamoRecordCrediticio): number {
    return this.pie.completados.reduce((accumulator, current) => {
      return accumulator + (current[property] as number || 0);
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
      this.idCliente = cliente.id;
      this.getRecordCrediticio();
    }
  }

  async getRecordCrediticio() {
    await this.fetchRecordCrediticio();
  }

  private fetchRecordCrediticio(): Promise<any> {
    return firstValueFrom(
      this._globalService
        .Get(`prestamos/reporte-recordCrediticio?idCliente=${this.idCliente}`)
        .pipe(
          tap((data: any) => {
            //console.log("Record Crediticio:", data);
            if (data.encabezados.length > 0) {
              this.encabezado = data.encabezados[0];
            }
            this.cuerpo = data.cuerpo;
            let counter = 1;
            this.cuerpo.forEach((c: CuerpoRecordCrediticio) => {
              c.nCuota = counter;
              counter++;
            });
            this.pie = data.pie;
            this.fetchAsesor();
          }),
          catchError((error) => {
            console.error("Error fetching records:", error);
            throw error;
          })
        )
    );
  }

  private fetchAsesor() {
    return firstValueFrom(
      this._globalService
        .Get(`usuario-clientes/by-cliente/${this.selectedCliente.id}`)
        .pipe(
          tap((asesor: any) => {
            //console.log("Asesor:", asesor);
            this.selectedAsesor = asesor;
          }),
          catchError((error) => {
            console.error("Error fetching asesor:", error);
            throw error;
          })
        )
    );
  }
}
