import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPrestamoPageRoutingModule } from './view-prestamo-routing.module';

import { ViewPrestamoPage } from './view-prestamo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPrestamoPageRoutingModule
  ],
  declarations: [ViewPrestamoPage]
})
export class ViewPrestamoPageModule {}
