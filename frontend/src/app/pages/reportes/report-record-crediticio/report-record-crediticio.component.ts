import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import {
  Cuerpo,
  Encabezado,
  Pie,
} from "src/app/shared/interfaces/report-record-crediticio";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
  selector: "app-report-record-crediticio",
  templateUrl: "./report-record-crediticio.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportRecordCrediticioComponent implements OnInit {
  @Input() company: string = "Company N/D";
  selectedCliente: any = null;
  selectedAsesor: any = null;

  idCliente: number = 0;
  encabezado: Encabezado = {
    idPrestamo: 'N/A',
    cliente: "N/A",
    direccion: "N/A",
    telefono: "N/A",
    asesor: "N/A",
    producto: "N/A",
    etapa: "N/A",
    numeroTotalPtmos: 'N/A',
    fechaProceso: "N/A",
    recordCrediticio: "N/A",
    cantidadDesembolso: 0,
  };
  pie: Pie[] = [];
  cuerpo: Cuerpo[] = [];

  dateNow: Date = new Date();

  private _globalService = inject(GlobalService);

  constructor() {}

  ngOnInit() {
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
            console.log("Record Crediticio:", data);
            this.encabezado = data.encabezado[0];
            this.cuerpo = data.cuerpo;
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
            console.log("Asesor:", asesor);
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
