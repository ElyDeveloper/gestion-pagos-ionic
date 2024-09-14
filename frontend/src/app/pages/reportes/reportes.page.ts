import { Component, inject, OnInit } from "@angular/core";
import { NgxPrintService, PrintOptions } from "ngx-print";
import { LoaderService } from "src/app/shared/services/loader.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.page.html",
  styleUrls: ["./reportes.page.scss"],
})
export class ReportesPage implements OnInit {
  company: string = "Company N/D";
  isPrint = false;

  isToastOpen = false;
  toastMessage: string = "cliente guardado correctamente";
  toastColor: string = "primary";
  textLoader: string = "primary";

  reporteSeleccionado: string | null = null;
  loading = true;
  listData = new Array(3).fill({}).map((_i, index) => ({
    href: "http://ng.ant.design",
    title: `ant design part ${index}`,
    // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources " +
      "(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  }));

  private _printService = inject(NgxPrintService);
  private _loaderService = inject(LoaderService);
  constructor() {}

  ngOnInit() {
    this.company = environment.company;
  }

  seleccionarReporte(tipo: string) {
    this.reporteSeleccionado = tipo;
  }

  printSection() {
    this.isPrint = true;
    this.textLoader = "Imprimiendo...";
    this._loaderService.show();
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: "report-mora",

      // Add any other print options as needed
    });
    this._printService.styleSheetFile = "assets/css/print.css";

    //eliminar elemento         key: "actions", del objeto columnsData

    //esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this._printService.print(customPrintOptions);

      //Volver a colocar la columna actions

      this.isPrint = false;
      this._loaderService.hide();
    }, 1000);
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }
}
