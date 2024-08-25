import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPagoPage } from './gestion-pago.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPagoPageRoutingModule {}
