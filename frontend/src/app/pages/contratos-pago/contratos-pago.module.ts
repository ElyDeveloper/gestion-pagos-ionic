import { NgModule } from '@angular/core';

import { ContratosPagoPageRoutingModule } from './contratos-pago-routing.module';

import { ContratosPagoPage } from './contratos-pago.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ContratosPagoPageRoutingModule
  ],
  declarations: [ContratosPagoPage]
})
export class ContratosPagoPageModule {}
