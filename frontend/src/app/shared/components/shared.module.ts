import { NgModule } from '@angular/core';

//MODULOS DE IONIC
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from '@ionic/angular';

//COMPONENTES
import { TableDataComponent } from './table-data/table-data.component';
import { ReusableModalComponent } from './reusable-modal/reusable-modal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LoaderComponent } from './loader/loader.component';

//MODULOS EXTERNOS
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [
    TableDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports: [
    TableDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    LoaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
