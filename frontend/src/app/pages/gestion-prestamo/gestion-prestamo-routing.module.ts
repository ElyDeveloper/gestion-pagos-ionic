import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPrestamoPage } from './gestion-prestamo.page';

const routes: Routes = [
  {
    path: '',
    component: GestionPrestamoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionPrestamoPageRoutingModule {}
