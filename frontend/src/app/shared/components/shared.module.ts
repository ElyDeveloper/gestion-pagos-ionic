import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TableDataComponent } from './table-data/table-data.component';

@NgModule({
  declarations: [
    TableDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    TableDataComponent,
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class SharedModule { }
