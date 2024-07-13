import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesPagosPage } from './reportes-pagos.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesPagosPageRoutingModule {}
