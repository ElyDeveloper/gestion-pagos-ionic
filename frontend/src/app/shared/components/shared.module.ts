import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";


import { IonicModule } from '@ionic/angular';

import { TableDataComponent } from './table-data/table-data.component';
import { ReusableModalComponent } from './reusable-modal/reusable-modal.component';

@NgModule({
  declarations: [
    TableDataComponent,
    ReusableModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    TableDataComponent,
    ReusableModalComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule { }
