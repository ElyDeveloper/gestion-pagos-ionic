import { NgModule } from "@angular/core";


import { ReportesPageRoutingModule } from "./reportes-routing.module";

import { ReportesPage } from "./reportes.page";

//INFO: COMPONENTES
import { ReportEstadoCuentaComponent } from "./report-estado-cuenta/report-estado-cuenta.component";
import { ReportClientsMoraComponent } from "./report-clients-mora/report-clients-mora.component";
import { ReportRecordCrediticioComponent } from "./report-record-crediticio/report-record-crediticio.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ReportCarteraAsesoresComponent } from "./report-cartera-asesores/report-cartera-asesores.component";
import { ReportLoaderComponent } from "./report-loader/report-loader.component";

//INFO: MODULES
import { NzListModule } from "ng-zorro-antd/list";
import { NzResultModule } from "ng-zorro-antd/result";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";


@NgModule({
  imports: [SharedModule, ReportesPageRoutingModule, NzListModule, NzResultModule, NzSkeletonModule],
  declarations: [
    ReportesPage,
    ReportEstadoCuentaComponent,
    ReportClientsMoraComponent,
    ReportRecordCrediticioComponent,
    ReportCarteraAsesoresComponent,
    ReportLoaderComponent
  ],
})
export class ReportesPageModule {}
