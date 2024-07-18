import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/components/shared.module';

import { PagosPageRoutingModule } from './pagos-routing.module';

import { PagosPage } from './pagos.page';

@NgModule({
  imports: [
    SharedModule,
    PagosPageRoutingModule
  ],
  declarations: [PagosPage]
})
export class PagosPageModule {}
