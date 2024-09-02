import { NgModule } from '@angular/core';

import { PrestamosPageRoutingModule } from './prestamos-routing.module';

import { PrestamosPage } from './prestamos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PrestamosPageRoutingModule
  ],
  declarations: [PrestamosPage]
})
export class PrestamosPageModule {}
