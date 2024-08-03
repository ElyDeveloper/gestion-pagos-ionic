import { NgModule } from "@angular/core";

//MODULOS DE IONIC
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

//COMPONENTES
import { ViewDataComponent } from "./view-data/view-data.component";
import { ReusableModalComponent } from "./reusable-modal/reusable-modal.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { LoaderComponent } from "./loader/loader.component";

//INFO: PIPES
import { CustomDatePipe } from "../pipes/date.pipe";
import { FormatDniPipe } from "../pipes/dni.pipe";

//INFO MODULOS EXTERNOS
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    LoaderComponent,
    CustomDatePipe,
    FormatDniPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  exports: [
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    LoaderComponent,
    CustomDatePipe,
    FormatDniPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxSpinnerModule,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
