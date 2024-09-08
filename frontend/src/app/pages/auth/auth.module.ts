import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NgxSpinnerModule } from "ngx-spinner";

import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { WrapperComponent } from "src/app/shared/components/wrapper/wrapper.component";
import { BreadcrumbComponent } from "src/app/shared/components/breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [LoaderComponent, WrapperComponent, BreadcrumbComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    LoaderComponent,
    WrapperComponent,
    BreadcrumbComponent,
  ],
})
export class AuthModule {}
