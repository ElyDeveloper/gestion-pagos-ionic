import { NgModule } from '@angular/core';

import { PersonasPageRoutingModule } from './personas-routing.module';

import { PersonasPage } from './personas.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    PersonasPageRoutingModule,
    SharedModule
  ],
  declarations: [PersonasPage]
})
export class PersonasPageModule {}
