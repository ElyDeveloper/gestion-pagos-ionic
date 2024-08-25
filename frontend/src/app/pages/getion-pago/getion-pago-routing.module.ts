import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetionPagoPage } from './getion-pago.page';

const routes: Routes = [
  {
    path: '',
    component: GetionPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetionPagoPageRoutingModule {}
