import { NgModule } from '@angular/core';

import { LayoutPageRoutingModule } from './layout-routing.module';

import { LayoutPage } from './layout.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LayoutPageRoutingModule
  ],
  declarations: [LayoutPage],
  exports: []
})
export class LayoutPageModule {}
