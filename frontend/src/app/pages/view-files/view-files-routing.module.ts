import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewFilesPage } from './view-files.page';

const routes: Routes = [
  {
    path: '',
    component: ViewFilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewFilesPageRoutingModule {}
