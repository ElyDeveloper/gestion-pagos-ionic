import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesPagosPageRoutingModule } from './reportes-pagos-routing.module';

import { ReportesPagosPage } from './reportes-pagos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesPagosPageRoutingModule
  ],
  declarations: [ReportesPagosPage]
})
export class ReportesPagosPageModule {}
