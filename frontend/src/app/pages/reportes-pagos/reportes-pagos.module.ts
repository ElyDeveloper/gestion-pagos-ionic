import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/components/shared.module';

import { ReportesPagosPageRoutingModule } from './reportes-pagos-routing.module';

import { ReportesPagosPage } from './reportes-pagos.page';

@NgModule({
  imports: [
    SharedModule,
    ReportesPagosPageRoutingModule
  ],
  declarations: [ReportesPagosPage]
})
export class ReportesPagosPageModule {}
