import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratosPagoPageRoutingModule } from './contratos-pago-routing.module';

import { ContratosPagoPage } from './contratos-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContratosPagoPageRoutingModule
  ],
  declarations: [ContratosPagoPage]
})
export class ContratosPagoPageModule {}
