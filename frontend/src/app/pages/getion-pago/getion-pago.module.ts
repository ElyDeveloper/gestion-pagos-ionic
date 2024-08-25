import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetionPagoPageRoutingModule } from './getion-pago-routing.module';

import { GetionPagoPage } from './getion-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetionPagoPageRoutingModule
  ],
  declarations: [GetionPagoPage]
})
export class GetionPagoPageModule {}
