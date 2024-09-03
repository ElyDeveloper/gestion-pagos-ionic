import { NgModule } from "@angular/core";

import { AuthModule } from "src/app/pages/auth/auth.module";

//INFO: COMPONENTES
import { ViewDataComponent } from "./components/view-data/view-data.component";
import { ReusableModalComponent } from "./components/reusable-modal/reusable-modal.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { CardViewInfoComponent } from "./components/card-view-info/card-view-info.component";
import { UploaderComponent } from "./components/uploader/uploader.component";

//INFO: PIPES
import { DatePipe } from "@angular/common";
import { CustomDatePipe } from "./pipes/date.pipe";
import { FormatDniPipe } from "./pipes/dni.pipe";
import { NumberToWordsPipe } from "./pipes/number-to-words.pipe";
import { XmlToListPipe } from "./pipes/xml-to-list.pipe";

//INFO MODULES
import { FileUploadModule } from "ng2-file-upload";
import { NgSelectModule } from "@ng-select/ng-select";
import { InputMaskDirective } from "./directives/input-mask.directive";

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

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
    NumberToWordsPipe,
    XmlToListPipe,
    InputMaskDirective,
    
  ],
  imports: [AuthModule, FileUploadModule, NgSelectModule, NgbDatepickerModule ],
  exports: [
    AuthModule,
    FileUploadModule,
    NgSelectModule,
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    BreadcrumbComponent,
    CardViewInfoComponent,
    UploaderComponent,
    CustomDatePipe,
    FormatDniPipe,
    NumberToWordsPipe,
    XmlToListPipe,
    InputMaskDirective,
    NgbDatepickerModule,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
