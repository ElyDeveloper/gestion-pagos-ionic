import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPagoPageRoutingModule } from './gestion-pago-routing.module';

import { GestionPagoPage } from './gestion-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionPagoPageRoutingModule
  ],
  declarations: [GestionPagoPage]
})
export class GestionPagoPageModule {}
