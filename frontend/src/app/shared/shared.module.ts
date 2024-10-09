import { NgModule } from "@angular/core";

import { AuthModule } from "src/app/pages/auth/auth.module";

//INFO: COMPONENTES
import { ViewDataComponent } from "./components/view-data/view-data.component";
import { ReusableModalComponent } from "./components/reusable-modal/reusable-modal.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
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
import { NgxPrintModule } from "ngx-print";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzResultModule } from "ng-zorro-antd/result";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
import { NzListModule } from "ng-zorro-antd/list";
import { PreventAbuseService } from "./services/prevent-abuse.service";

//NG-ZORRO
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@NgModule({
  declarations: [
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    CardViewInfoComponent,
    UploaderComponent,
    CustomDatePipe,
    FormatDniPipe,
    NumberToWordsPipe,
    XmlToListPipe,
    InputMaskDirective,
  ],
  imports: [
    AuthModule,
    FileUploadModule,
    NgSelectModule,
    NgxPrintModule,
    NzDatePickerModule, // IMPORTANT: for Ant Design DatePicker
    NzResultModule, // IMPORTANT: for Ant Design Result Module
    NzSkeletonModule, // IMPORTANT: for Ant Design Skeleton Module
    NzListModule, // IMPORTANT: for Ant Design List Module
    NzPaginationModule, // IMPORTANT: for Ant Design Pagination Module
  ],
  exports: [
    AuthModule,
    FileUploadModule,
    NgSelectModule,
    ViewDataComponent,
    ReusableModalComponent,
    NavbarComponent,
    CardViewInfoComponent,
    UploaderComponent,
    CustomDatePipe,
    FormatDniPipe,
    NumberToWordsPipe,
    XmlToListPipe,
    InputMaskDirective,
    NgxPrintModule,
    NzDatePickerModule, // IMPORTANT: for Ant Design DatePicker
    NzResultModule, // IMPORTANT: for Ant Design Result Module
    NzSkeletonModule, // IMPORTANT: for Ant Design Skeleton Module
    NzListModule, // IMPORTANT: for Ant Design List Module
    NzPaginationModule, // IMPORTANT: for Ant Design Pagination Module
  ],
  providers: [DatePipe, PreventAbuseService],
})
export class SharedModule {}
