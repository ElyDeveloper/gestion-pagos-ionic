import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewFilesPageRoutingModule } from './view-files-routing.module';

import { ViewFilesPage } from './view-files.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewFilesPageRoutingModule
  ],
  declarations: [ViewFilesPage]
})
export class ViewFilesPageModule {}
