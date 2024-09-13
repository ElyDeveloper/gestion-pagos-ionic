import { NgModule } from "@angular/core";


import { ReportesPageRoutingModule } from "./reportes-routing.module";

import { ReportesPage } from "./reportes.page";

//INFO: COMPONENTES
import { ReportEstadoCuentaComponent } from "./report-estado-cuenta/report-estado-cuenta.component";
import { ReportClientsMoraComponent } from "./report-clients-mora/report-clients-mora.component";
import { ReportRecordCrediticioComponent } from "./report-record-crediticio/report-record-crediticio.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ReportCarteraAsesoresComponent } from "./report-cartera-asesores/report-cartera-asesores.component";

@NgModule({
  imports: [SharedModule, ReportesPageRoutingModule],
  declarations: [
    ReportesPage,
    ReportEstadoCuentaComponent,
    ReportClientsMoraComponent,
    ReportRecordCrediticioComponent,
    ReportCarteraAsesoresComponent
  ],
})
export class ReportesPageModule {}
