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
import { UploaderComponent } from "./uploader/uploader.component";

//INFO MODULES
import { FileUploadModule } from "ng2-file-upload";


@NgModule({
  declarations: [
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    CardViewInfoComponent,
    UploaderComponent,
    CustomDatePipe,
    FormatDniPipe,
  ],
  imports: [AuthModule, FileUploadModule],
  exports: [
    AuthModule,
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    CardViewInfoComponent,
    UploaderComponent,
    CustomDatePipe,
    FormatDniPipe,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
