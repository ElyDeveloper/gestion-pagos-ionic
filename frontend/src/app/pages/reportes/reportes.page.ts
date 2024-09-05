import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.page.html",
  styleUrls: ["./reportes.page.scss"],
})
export class ReportesPage implements OnInit {
  company: string = "Company N/D";

  reporteSeleccionado: string | null = null;
  loading = true;
  listData = new Array(3).fill({}).map((_i, index) => ({
    href: 'http://ng.ant.design',
    title: `ant design part ${index}`,
    // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources ' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  }));

  constructor() {}

  ngOnInit() {
    this.company = environment.company;
  }

  seleccionarReporte(tipo: string) {
    this.reporteSeleccionado = tipo;
  }
}
