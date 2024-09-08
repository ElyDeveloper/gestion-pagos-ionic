import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { NgxPrintService, PrintOptions } from "ngx-print";
import { Subscription } from "rxjs";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { Prestamos } from "src/app/shared/interfaces/prestamo";
import { GlobalService } from "src/app/shared/services/global.service";
import { environment } from "src/environments/environment";

const PERCENTAGE = environment.percentage;
const MILLISECONDS_PER_DAY = 1000 * 3600 * 24;

@Component({
  selector: "app-report-clients-mora",
  templateUrl: "./report-clients-mora.component.html",
  styleUrls: ["../reportes.page.scss"],
})
export class ReportClientsMoraComponent implements OnInit {
  @Input() company: string = "Company N/D";

  @ViewChild(LoaderComponent) private loaderComponent!: LoaderComponent;

  elements: Prestamos[] = [];

  isPrint = false;

  isToastOpen = false;
  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  textLoader: string = "primary";

  private suscriptions: Subscription[] = [];

  uploader!: FileUploader;

  private globalService = inject(GlobalService);
  private printService = inject(NgxPrintService);

  constructor() {}

  ngOnInit(): void {}

  printSection() {
    this.isPrint = true;
    this.textLoader = "Imprimiendo...";
    this.loaderComponent.show();
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: "print-section",

      // Add any other print options as needed
    });
    this.printService.styleSheetFile = "assets/css/print.css";

    //eliminar elemento         key: "actions", del objeto columnsData

    //esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this.printService.print(customPrintOptions);

      //Volver a colocar la columna actions

      this.isPrint = false;
      this.loaderComponent.hide();
    }, 1000);
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }

  ionViewDidEnter() {
    this.getPrestamosWithMora();
  }

  getPrestamosWithMora() {}

  ionViewDidLeave() {
    this.suscriptions.forEach((sub) => sub.unsubscribe());
  }

  scrollToElement(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
