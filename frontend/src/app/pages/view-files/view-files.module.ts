import { NgModule } from "@angular/core";

import { ViewFilesPageRoutingModule } from "./view-files-routing.module";

import { ViewFilesPage } from "./view-files.page";
import { SharedModule } from "src/app/shared/shared.module";
import { PdfViewerModule } from "ng2-pdf-viewer";

@NgModule({
  imports: [
    SharedModule,
    ViewFilesPageRoutingModule,
    PdfViewerModule,
  ],
  declarations: [ViewFilesPage],
})
export class ViewFilesPageModule {}
