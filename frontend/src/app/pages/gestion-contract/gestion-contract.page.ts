import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { GlobalService } from "src/app/shared/services/global.service";
import jsPDF, { Html2CanvasOptions, jsPDFOptions } from "jspdf";
import html2canvas from "html2canvas";
import { environment } from "src/environments/environment";
import { filter, map } from "rxjs";
import { Title } from "@angular/platform-browser";
import { ContratosPago } from "src/app/shared/interfaces/contrato";
const COMPANY = environment.company || "No Aún";
@Component({
  selector: "app-gestion-contract",
  templateUrl: "./gestion-contract.page.html",
  styleUrls: ["./gestion-contract.page.scss"],
})
export class GestionContractPage implements OnInit {
  @ViewChild(LoaderComponent) loaderComponent!: LoaderComponent;

  //INFO
  @Output() changeView: EventEmitter<void> = new EventEmitter();

  // @ViewChild('printElement') printElement: ElementRef;

  showData: boolean = false;
  showContent: boolean = true;
  isPrint: boolean = false;

  urls: any = {
    getMedidores: "/get-dataMedidores",
  };

  //INFO

  isModalOpen = false;
  isToastOpen = false;
  isEdit = false;
  hasAval = false;
  existContrato: boolean = false;

  editarBancoDepositar: boolean = false;
  editarCuentaBancaria: boolean = false;
  editarCiudadBanco: boolean = false;
  editarDireccionEmpresa: boolean = false;
  editarFechaAcuerdo: boolean = false;
  editarLugarAcuerdo: boolean = false;

  nombreEmpresa: string = COMPANY;
  bancoDepositar: string = "";
  ciudadBanco: string = "";
  cuentaBancaria: string = "";
  direccionEmpresa: string = "";
  fechaAcuerdo: string = "";
  lugarAcuerdo: string = "";

  textLoader: string = "Cargando...";
  toastMessage: string = "cliente guardado correctamente";
  title: string = "Todos";
  action: string = "todos";

  correlativo: string = "";

  clienteSeleccionado: any = null;
  avalSeleccionado: any = null;
  prestamoSeleccionado: any = {};

  private _globalService = inject(GlobalService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _titleService = inject(Title);

  constructor() {}

  ngOnInit() {
    this.getPrestamo();
    this.getCorrelativo();
  }

  verifyExist() {
    this._globalService
      .Get(`contratos-pagos/verify/${this.prestamoSeleccionado.id}`)
      .subscribe({
        next: (data: any) => {
          const { exist, content, correlativo } = data;

          console.log("Contrato existente", data);
          if (exist) {
            this.existContrato = true;
            this.correlativo = correlativo;
            //INFO: Otra Data
            this.nombreEmpresa = content.nombreEmpresa;
            this.bancoDepositar = content.bancoDepositar;
            this.ciudadBanco = content.ciudadBanco;
            this.cuentaBancaria = content.cuentaBancaria;
            this.direccionEmpresa = content.direccionEmpresa;
            this.fechaAcuerdo = content.fechaAcuerdo;
            this.lugarAcuerdo = content.lugarAcuerdo;
          } else {
            // this.saveContract();
          }
        },
        error: (error: any) => {
          console.error("Error al verificar si existe el contrato", error);
        },
      });
  }

  getCorrelativo() {
    this._globalService.Get("contratos-pagos/correlativo").subscribe({
      next: (data: any) => {
        this.correlativo = data.correlativo;
      },
      error: (error: any) => {
        console.error(
          "Error al obtener la cantidad de contratos de pago",
          error
        );
      },
    });
  }

  setTitle() {
    this._titleService.setTitle(
      "Contrato - " +
        this.clienteSeleccionado.nombres +
        " " +
        this.clienteSeleccionado.apellidos +
        " " +
        new Date().getTime()
    );
  }

  ionViewWillLeave() {
    this._titleService.setTitle("Gestión Pagos");
  }

  changeViewState() {
    this.changeView.emit();
  }

  generateContract() {
    //Validar que todos los campos estén llenos
    if (
      !this.nombreEmpresa ||
      !this.bancoDepositar ||
      !this.ciudadBanco ||
      !this.cuentaBancaria ||
      !this.direccionEmpresa ||
      !this.fechaAcuerdo ||
      !this.lugarAcuerdo
    ) {
      this.toastMessage = "Por favor, complete correctamente todos los campos.";
      this.setOpenedToast(true);
      return;
    }

    if (this.existContrato) {
      this.loaderComponent.show();

      this.printSection();
      return;
    }

    const content = {
      nombreEmpresa: this.nombreEmpresa,
      bancoDepositar: this.bancoDepositar,
      ciudadBanco: this.ciudadBanco,
      cuentaBancaria: this.cuentaBancaria,
      direccionEmpresa: this.direccionEmpresa,
      fechaAcuerdo: this.fechaAcuerdo,
      lugarAcuerdo: this.lugarAcuerdo,
    };
    const contractSave: ContratosPago = {
      correlativo: this.correlativo,
      fechaGeneracion: new Date().toISOString(),
      contenido: JSON.stringify(content),
      idPrestamo: this.prestamoSeleccionado.id,
    };

    this.loaderComponent.show();
    this._globalService.Post("contratos-pagos", contractSave).subscribe({
      next: (data: any) => {
        console.log("Contrato guardado correctamente", data);
        this.isPrint = false;
        this.printSection();
      },
      error: (error: any) => {
        this.loaderComponent.show();

        console.error("Error al guardar el contrato", error);
      },
    });
  }

  printSection() {
    this.isPrint = true;
    this.changeViewState();
    //Esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this.loaderComponent.hide();

      var contentToPrint = document.getElementById(
        "contentToPrint"
      ) as HTMLElement;

      //Verificar si hay contenido para imprimir
      if (!contentToPrint) {
        this.isPrint = false;
        this.changeViewState();
        return;
      }

      // Obtener las tablas
      // var tables = document.querySelectorAll('#contentToPrint table');
      // var canvases: any = document.querySelectorAll('#contentToPrint canvas');

      // // Cambiar el tamaño de la fuente de las tablas a 8px
      // tables.forEach(function (table: any) {
      //   table.style.fontSize = '18px';
      // });

      // Convertir cada canvas en una imagen y agregarla al documento temporal
      // canvases.forEach(function (canvas: any) {
      //   var canvasImg = canvas.toDataURL('image/png');

      //   //Reemplazar el canvas por una imagen
      //   var img = document.createElement('img');
      //   img.src = canvasImg;

      //   img.style.width = '100%';
      //   img.style.height = '100%';

      //   canvas.parentNode.replaceChild(img, canvas);
      // });

      // Ocultar la URL del documento durante la impresión
      const style = document.createElement("style");
      style.innerHTML = `
      @page {
        size: A4 portrait;
        margin: 0;
      }
  
      @media print {
        @page { margin-bottom: 0; margin-top: 0; }
        
        body::after { content: none !important;
      }
    `;

      // contentToPrint.innerHTML = contentToPrint.innerHTML;
      contentToPrint.appendChild(style);

      // var contentToPrint = document.getElementById('contentToPrint').innerHTML;
      // document.body.innerHTML = contentToPrint.innerHTML;

      //Esperar a que se cargue la imagen
      setTimeout(() => {
        // Imprimir el contenido
        window.print();
        //Eliminar los estilos
        contentToPrint.removeChild(style);
        this.isPrint = false;
        console.log("Valor isPrint desde RangePicker: ", this.isPrint);
        this.changeViewState();
        console.log("Se ha restablecido el componente...");
        // window.location.reload();
      }, 3000);
    }, 1000);
  }

  exportToPDF(name: string, idElement: string) {
    // Extraemos el
    const DATA = document.getElementById(idElement) as HTMLElement;
    const doc = new jsPDF("p", "pt", "letter");
    const options = {
      backgroundColor: "white",
      scale: 1,
    };

    // Crear un elemento de estilo
    const style = document.createElement("style");
    style.textContent = `
      p{
        font-size: 30px!important;
      }
      
      h3{
        font-size: 32px!important;
      }
    `;

    // Añadir los estilos al head
    document.head.appendChild(style);

    this.textLoader = "Generando Pdf";
    this.loaderComponent.show();
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL("image/PNG");

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          "PNG",
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST"
        );
        return doc;
      })
      .then((docResult: any) => {
        const fecha = new Date();
        const time = fecha.getTime();

        docResult.save(`Pagaré(${name} - ${time}).pdf`);
        document.head.removeChild(style);

        //console.log('Error: ', err);
        this.loaderComponent.hide();
      })
      .catch((err: any) => {
        document.head.removeChild(style);

        //console.log('Error: ', err);
        this.loaderComponent.hide();
      });
  }
  getPrestamo() {
    //Obtener id de la url
    this._route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this._globalService.GetByIdEncrypted("prestamos", id).subscribe({
          next: (prestamo: any) => {
            if (prestamo) {
              prestamo = this._globalService.parseObjectDates(prestamo);
              console.log("Prestamo: ", prestamo);
              this.prestamoSeleccionado = prestamo;
              this.clienteSeleccionado = prestamo.cliente;
              this.avalSeleccionado = prestamo.aval;
              if (prestamo.idAval) {
                this.hasAval = true;
              }
              console.log("Plan de Pago: ", prestamo.planPago);

              this.setTitle();

              this.isEdit = true;
              this.verifyExist();
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.prestamoSeleccionado = null;
        this.isEdit = false;
      }
    });
  }

  toLowerCase(texto: string): string {
    if (texto) {
      return texto.toLowerCase();
    } else {
      return "No aún";
    }
  }

  formatDate(fechaStr: string): string {
    // console.log('FEcha: ', fechaStr)
    if (fechaStr) {
      const fecha = fechaStr.split("-");
      const dia = parseInt(fecha[2]);
      const mes = this.getNombreMes(parseInt(fecha[1]) - 1);
      const anio = parseInt(fecha[0]);
      return `${dia} de ${mes} del año ${anio}`;
    }

    return "No aún";
  }

  private getNombreMes(mes: number): string {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return meses[mes];
  }

  convertirNumero(numero: number): string {
    if (numero) {
      return this._globalService.numberToText(numero);
    } else {
      return "No aún";
    }
  }

  setOpenedToast(value: boolean) {
    this.isToastOpen = value;
  }
}
