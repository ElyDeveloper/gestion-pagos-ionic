import { NgModule } from '@angular/core';

import { ReportesPagosPageRoutingModule } from './reportes-pagos-routing.module';

import { ReportesPagosPage } from './reportes-pagos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ReportesPagosPageRoutingModule
  ],
  declarations: [ReportesPagosPage]
})
export class ReportesPagosPageModule {}
