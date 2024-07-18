import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/components/shared.module';

import { PrestamosPageRoutingModule } from './prestamos-routing.module';

import { PrestamosPage } from './prestamos.page';

@NgModule({
  imports: [
    SharedModule,
    PrestamosPageRoutingModule
  ],
  declarations: [PrestamosPage]
})
export class PrestamosPageModule {}
