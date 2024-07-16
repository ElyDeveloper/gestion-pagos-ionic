import { NgModule } from '@angular/core';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';

import { SharedModule } from '../../shared/components/shared.module';

@NgModule({
  imports: [
    ClientesPageRoutingModule,
    SharedModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
