import { NgModule } from "@angular/core";

import { GestionPrestamoPageRoutingModule } from "./gestion-prestamo-routing.module";

import { GestionPrestamoPage } from "./gestion-prestamo.page";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [SharedModule, GestionPrestamoPageRoutingModule],
  declarations: [GestionPrestamoPage],
})
export class GestionPrestamoPageModule {}
