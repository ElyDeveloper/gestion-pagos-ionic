import { NgModule } from '@angular/core';

import { PagosPageRoutingModule } from './pagos-routing.module';

import { PagosPage } from './pagos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PagosPageRoutingModule
  ],
  declarations: [PagosPage]
})
export class PagosPageModule {}
