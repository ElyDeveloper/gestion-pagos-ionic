import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "src/app/shared/services/global.service";
import { environment } from "src/environments/environment";
import { catchError, firstValueFrom, Subscription, tap } from "rxjs";
import { Title } from "@angular/platform-browser";
import { ContratosPago } from "src/app/shared/interfaces/contrato";
import { LoaderService } from "src/app/shared/services/loader.service";
import { NgxPrintService, PrintOptions } from "ngx-print";
const COMPANY = environment.company || "No Aún";
const PERCENTAGE = environment.percentage * 100;
@Component({
  selector: "app-gestion-contract",
  templateUrl: "./gestion-contract.page.html",
  styleUrls: ["./gestion-contract.page.scss"],
})
export class GestionContractPage implements OnInit {
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
  isAprobado: boolean = false;

  editarBancoDepositar: boolean = false;
  editarCuentaBancaria: boolean = false;
  editarCiudadBanco: boolean = false;
  editarDireccionEmpresa: boolean = false;
  editarFechaAcuerdo: boolean = false;
  editarLugarAcuerdo: boolean = false;

  nombreEmpresa: string = COMPANY;
  percentage: string = PERCENTAGE.toString();
  bancoDepositar: string = "";
  ciudadBanco: string = "";
  cuentaBancaria: string = "";
  direccionEmpresa: string = "";
  fechaAcuerdo: string = "";
  lugarAcuerdo: string = "";

  textLoader: string = "Cargando...";
  toastColor: string = "primary";
  toastMessage: string = "cliente guardado correctamente";
  title: string = "Todos";
  action: string = "todos";

  correlativo: string = "";

  clienteSeleccionado: any = null;
  avalSeleccionado: any = null;
  prestamoSeleccionado: any = {};

  suscripciones: Subscription[] = [];

  private _globalService = inject(GlobalService);
  private _route = inject(ActivatedRoute);
  private _loaderService = inject(LoaderService);
  private _titleService = inject(Title);
  private _printService = inject(NgxPrintService);

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getPrestamo();
    this.getCorrelativo();
  }

  ionViewWillLeave() {
    this._titleService.setTitle("Gestión Pagos");
  }

  verifyExist() {
    firstValueFrom(
      this._globalService.Get(
        `contratos-pagos/verify/${this.prestamoSeleccionado.id}`
      )
    )
      .then((data: any) => {
        const { exist, content, correlativo } = data;

        //console.log("Contrato existente", data);
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
      })
      .catch((error: any) => {
        console.error("Error al verificar si existe el contrato", error);
      });
  }

  getCorrelativo() {
    firstValueFrom(this._globalService.Get("contratos-pagos/correlativo"))
      .then((data: any) => {
        this.correlativo = data.correlativo;
      })
      .catch((error: any) => {
        console.error(
          "Error al obtener la cantidad de contratos de pago",
          error
        );
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
      this._loaderService.show();
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

    this._loaderService.show();
    firstValueFrom(this._globalService.Post("contratos-pagos", contractSave))
      .then((data: any) => {
        //console.log("Contrato guardado correctamente", data);
        this.isPrint = false;
        this.printSection();
      })
      .catch((error: any) => {
        this._loaderService.show();
        console.error("Error al guardar el contrato", error);
      });
  }

  printSection() {
    this.textLoader = "Imprimiendo...";
    this._loaderService.show();
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: "print-contract",
      printTitle:
        "Contrato de Pago" +
        "-" +
        this.clienteSeleccionado.nombres +
        " " +
        this.clienteSeleccionado.apellidos,
      openNewTab: true,

      // Add any other print options as needed
    });
    this._printService.styleSheetFile = "assets/css/print-contract.css";

    //esperar 1 segundo para que se muestre el loader
    setTimeout(() => {
      this._printService.print(customPrintOptions);

      this.isPrint = false;
      this._loaderService.hide();
    }, 1000);
  }

  async getPrestamo() {
    try {
      const params = await firstValueFrom(this._route.paramMap);
      const id = params.get("id");

      if (!id) {
        this.resetPrestamoState();
        return;
      }

      //console.log("ID Encrypted:", id);

      const idDecrypted = await this.getDecryptedId(id);
      //console.log("Decrypted ID:", idDecrypted);
      if (!idDecrypted) return;

      const prestamo = await this.fetchPrestamo(idDecrypted);
      this.updatePrestamoState(prestamo);
    } catch (error) {
      console.error("Error fetching prestamo:", error);
      // Consider adding user-friendly error handling here
    }
  }

  private getDecryptedId(id: string): Promise<number | any> {
    return firstValueFrom(
      this._globalService.GetIdDecrypted("decrypted-id", id).pipe(
        catchError((error: any) => {
          console.error("Error decrypting ID:", error);
          return error;
        })
      )
    );
  }

  private fetchPrestamo(idDecrypted: number): Promise<any> {
    return firstValueFrom(
      this._globalService.GetId("prestamos", idDecrypted).pipe(
        tap((prestamo: any) => {
          prestamo = this._globalService.parseObjectDates(prestamo);
          //console.log("Prestamo:", prestamo);
          //console.log("Plan de Pago:", prestamo.planPago);
        }),
        catchError((error) => {
          console.error("Error fetching prestamo:", error);
          throw error;
        })
      )
    );
  }

  private updatePrestamoState(prestamo: any): void {
    // console.log("Prestamo seleccionado:", prestamo);
    this.prestamoSeleccionado = prestamo;
    this.clienteSeleccionado = prestamo.cliente;
    this.avalSeleccionado = prestamo.aval;
    this.hasAval = !!prestamo.idAval;
    this.isEdit = true;
    this.setTitle();
    this.verifyExist();

    if (prestamo.estadoInterno.id !==1 && prestamo.estadoInterno.id!== 3) {
      this.isAprobado = true;
    }
  }

  private resetPrestamoState(): void {
    this.prestamoSeleccionado = null;
    this.isEdit = false;
  }

  toLowerCase(texto: string): string {
    if (texto) {
      return texto.toLowerCase();
    } else {
      return "No aún";
    }
  }

  formatDate(fechaStr: string): string {
    // //console.log('FEcha: ', fechaStr)
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
