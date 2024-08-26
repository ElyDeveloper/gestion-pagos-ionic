import { NgModule } from "@angular/core";

import { AuthModule } from "src/app/pages/auth/auth.module";

//INFO: COMPONENTES
import { ViewDataComponent } from "./view-data/view-data.component";
import { ReusableModalComponent } from "./reusable-modal/reusable-modal.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";

//INFO: PIPES
import { CustomDatePipe } from "../pipes/date.pipe";
import { FormatDniPipe } from "../pipes/dni.pipe";
import { DatePipe } from "@angular/common";
import { CardViewInfoComponent } from "./card-view-info/card-view-info.component";

//INFO MODULES

@NgModule({
  declarations: [
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    CardViewInfoComponent,
    CustomDatePipe,
    FormatDniPipe,
  ],
  imports: [AuthModule],
  exports: [
    AuthModule,
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    CardViewInfoComponent,
    CustomDatePipe,
    FormatDniPipe,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
