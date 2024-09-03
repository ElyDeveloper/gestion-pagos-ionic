import { NgModule } from "@angular/core";

import { GestionContractPageRoutingModule } from "./gestion-contract-routing.module";

import { GestionContractPage } from "./gestion-contract.page";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [SharedModule, GestionContractPageRoutingModule],
  declarations: [GestionContractPage],
})
export class GestionContractPageModule {}
