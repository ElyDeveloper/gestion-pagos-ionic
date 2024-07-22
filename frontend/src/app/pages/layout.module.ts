import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/components/shared.module';

import { LayoutPageRoutingModule } from './layout-routing.module';

import { LayoutPage } from './layout.page';

@NgModule({
  imports: [
    SharedModule,
    LayoutPageRoutingModule
  ],
  declarations: [LayoutPage],
  exports: []
})
export class LayoutPageModule {}
