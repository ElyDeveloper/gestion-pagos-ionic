import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionContractPage } from './gestion-contract.page';

const routes: Routes = [
  {
    path: '',
    component: GestionContractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionContractPageRoutingModule {}
