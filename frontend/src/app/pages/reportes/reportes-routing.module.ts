import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesPage } from './reportes.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesPageRoutingModule {}
