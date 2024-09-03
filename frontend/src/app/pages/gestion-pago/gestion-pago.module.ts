import { NgModule } from "@angular/core";

import { GestionPagoPageRoutingModule } from "./gestion-pago-routing.module";

import { GestionPagoPage } from "./gestion-pago.page";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [SharedModule, GestionPagoPageRoutingModule],
  declarations: [GestionPagoPage],
})
export class GestionPagoPageModule {}
