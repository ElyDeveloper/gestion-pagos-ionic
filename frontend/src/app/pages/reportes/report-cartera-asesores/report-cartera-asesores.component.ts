import { Component, inject, Input, OnInit } from "@angular/core";
import { catchError, firstValueFrom, tap } from "rxjs";
import { Cartera } from "src/app/shared/interfaces/cartera";
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

  private _globalService = inject(GlobalService);
  constructor() {}

  ngOnInit(): void {
    this.getCarteraAsesor(this.selectedAsesor);
  }

  async getCarteraAsesor(asesor:any) {
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
            console.log("Cartera asesor:", cartera);
            this.carteraAsesor = cartera;
          }),
          catchError((error) => {
            console.error("Error fetching prestamo:", error);
            throw error;
          })
        )
    );
  }
}
