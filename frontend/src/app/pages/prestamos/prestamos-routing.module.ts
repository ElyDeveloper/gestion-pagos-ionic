import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrestamosPage } from './prestamos.page';

const routes: Routes = [
  {
    path: '',
    component: PrestamosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrestamosPageRoutingModule {}
