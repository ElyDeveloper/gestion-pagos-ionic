import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratosPagoPage } from './contratos-pago.page';

const routes: Routes = [
  {
    path: '',
    component: ContratosPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratosPagoPageRoutingModule {}
