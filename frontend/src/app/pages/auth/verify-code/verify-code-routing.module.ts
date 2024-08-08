import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyCodePage } from './verify-code.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyCodePageRoutingModule {}
