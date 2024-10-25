import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { catchError, firstValueFrom, Subscription, tap } from "rxjs";
import { Pagos } from "src/app/shared/interfaces/pago";
import { Column } from "src/app/shared/interfaces/table";
import { GlobalService } from "src/app/shared/services/global.service";
import { ModalConfig } from "src/app/shared/utils/extra";

@Component({
  selector: "app-pagos",
  template: `
    <ion-content [fullscreen]="false">
      <app-wrapper
        [textLoader]="textLoader"
        [toastMessage]="toastMessage"
        [toastColor]="toastColor"
        [isToastOpen]="isToastOpen"
        (isToastOpenChange)="setOpenedToast($event)">
      </app-wrapper>
      <section class="container">
        <app-view-data
          [showAdd]="false"
          [data]="elements"
          [columnsData]="columnsData"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          [title]="'Pagos'"
          [context]="'Pago'"
          (currentPageOut)="onPageChange($event)"
          (openButtonClicked)="onOpenButtonClicked($event)"
          (uploadButtonClicked)="onUploadButtonClicked($event)"
          (searchOut)="onSearchData($event)"
          >
        </app-view-data>

        <app-reusable-modal
          [isOpen]="isModalOpen"
          [content]="modalUpload"
          (isOpenChange)="onModalOpenChange($event)"
          (saveData)="onSaveData()">
        </app-reusable-modal>

        <ng-template #modalUpload let-close="close" let-save="save">
          <ion-header>
            <ion-toolbar>
              <ion-title>Subir Comprobante</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="close()">Cerrar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <div class="container">
              <app-uploader
                (uploaderChange)="onUploaderChange($event)"
                (fileSelected)="onFileSelected($event)"></app-uploader>
              <div class="d-flex justify-content-center">
                <ion-button
                  [color]="'success'"
                  (click)="save({ type: 'file' }, false)"
                  [disabled]="!uploadedFile"
                  >Subir
                  <ion-icon class="ms-2" name="cloud-upload-outline"></ion-icon>
                </ion-button>
              </div>
            </div>
          </ion-content>
        </ng-template>
      </section>
    </ion-content>
  `,
})
export class PagosPage implements OnInit {
  elements: Pagos[] = []; // Aquí puedes almacenar los elementos obtenidos
  suscriptions: Subscription[] = [];

  textLoader = "primary";
  toastColor = "primary";
  toastMessage = "Elemento guardado correctamente";
  isToastOpen = false;

  currentPage = 1;
  currentPageSize = 10;
  totalPages = 0;
  columnsData: Column[] = []; // Aquí deberías recibir los datos a mostrar en la tabla (cabeceras)

  pagoSeleccionado: any = null;

  modalConfig: ModalConfig = {
    fieldAliases: {},
  };

  uploadedFile: File | null = null;

  isModalOpen: boolean = false;
  modalSelected: TemplateRef<any>;

  @ViewChild("modalUpload")
  modalUpload!: TemplateRef<any>;

  private _globalService = inject(GlobalService);
  private _router = inject(Router);

  constructor() {
    this.modalSelected = this.modalUpload;
  }

  ngOnInit() { }
  
  async onSearchData(event: any): Promise<void> {
    //console.log("Evento de búsqueda:", event);
    try {
      if (event === "") {
        await this.getCountElements();
      } else {
        await firstValueFrom(
          this._globalService
            .Get(
              `pagos/search?query=${event}`
            )
            .pipe(
              tap((res: any) => {
                this.elements = res;
                // console.log("Elementos obtenidos:", res);
              }),
              catchError((error) => {
                console.error("Error al obtener los elementos:", error);
                throw error;
              })
            )
        );
      }
    } catch (error) {
      console.error("Error en onSearchData:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  }

  onSaveData() {
    //console.log("Se guardara el archivo:", this.uploadedFile);

    console.log("Pago seleccionado:", this.pagoSeleccionado);
    firstValueFrom(
      this._globalService.PatchWithFile(
        "pagos/updateFile",
        this.pagoSeleccionado,
        this.uploadedFile
      )
    )
      .then(() => {
        this.getCountElements();
        this.toastMessage = "Archivo subido correctamente";
        this.toastColor = "success";
        this.isToastOpen = true;
        this.uploadedFile = null;
        this.isModalOpen = false;
      })
      .catch((error) => {
        //console.log("Error al subir el archivo:", error);
        this.toastMessage = "Error al subir el archivo";
        this.toastColor = "danger";
        this.isToastOpen = true;
      });
  }

  setOpenedToast(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  onModalOpenChange(event: any) {
    //console.log("Modal abierto:", event);
    this.isModalOpen = event;
  }

  onUploaderChange(event: any) {
    //console.log("Cambio en el uploader:", event);
  }

  onFileSelected(event: any) {
    //console.log("Archivo seleccionado:", event);
    this.uploadedFile = event;
  }

  ionViewWillEnter() {
    this.buildColumns();
    this.getCountElements();
  }

  onUploadButtonClicked(event: any) {
    console.log("Abrir botón para subir comprobante:", event);
    // Aquí puedes procesar el archivo como necesites
    this.pagoSeleccionado = event?.documentosTipoDoc?.documentos || null;
    if (!this.pagoSeleccionado) {
      this.pagoSeleccionado = {
        idPago: event?.id || 0,
      };
    }
    //console.log("Pago seleccionado:", this.pagoSeleccionado);
    this.modalSelected = this.modalUpload;
    this.isModalOpen = true;
  }

  onOpenButtonClicked(event: any) {
    //console.log("Abrir botón:", event);
    // Aquí puedes abrir un modal o acción relacionada con el elemento seleccionado

    const idDecrypted = event?.documentosTipoDoc?.documentos?.id || 0;
    firstValueFrom(
      this._globalService.GetIdEncrypted("encrypted-id", Number(idDecrypted))
    )
      .then((data: any) => {
        //console.log("ID encriptado:", data.idEncrypted);
        if (data) {
          this._router.navigate([`/view-file/${data.idEncrypted}`]);
        } else {
          console.error("No se encuentra el documento del pago.");
          this.toastColor = "danger";
          this.toastMessage = "No se encuentra el documento del pago.";
          this.isToastOpen = true;
        }
      })
      .catch((error) => {
        console.error("Error al obtener la ID encriptada:", error);
      });

    // redirigir a view-file
  }

  buildColumns() {
    this.columnsData = [
      {
        key: "cuota.id",
        alias: "ID Cuota",
      },
      {
        key: "monto",
        alias: "Monto Pago",
        type: "currency",
      },
      {
        key: "fechaPago",
        alias: "Fecha de Pago",
        type: "date",
      },
      {
        key: "cuota.planPago.prestamo.cliente.nombres",
        alias: "Nombre del Cliente",
      },
      {
        key: "cuota.planPago.prestamo.cliente.apellidos",
        alias: "Apellidos del Cliente",
      },
      {
        key: "cuota.planPago.prestamo.cliente.dni",
        alias: "DNI",
        type: "dni",
      },
      {
        key: "estado",
        alias: "Estado",
        type: "boolean",
        options: ["Pagado", "Pendiente"],
      },
      {
        key: "cuota.planPago.prestamo.totalMonto",
        alias: "Monto Total del Préstamo",
      },
      {
        key: "cuota.planPago.cuotasPagar",
        alias: "Cuotas a Pagar",
      },
      {
        key: "cuota.planPago.cuotaPagadas",
        alias: "Cuotas Pagadas",
      },
      {
        key: "actions",
        alias: "Acciones",
        lstActions: [
          {
            alias: "Cargar Archivo - ",
            action: "upload",
            icon: "cloud-upload",
            color: "success",
            rolesAuthorized: [1, 2, 3],
          },
          {
            alias: "Abrir Adjunto - ",
            action: "open",
            icon: "open",
            color: "secondary",
            rolesAuthorized: [1, 2],
          },
        ],
      },
    ];
  }
  getCountElements() {
    firstValueFrom(this._globalService.Get("pagos/count"))
      .then((response: any) => {
        //console.log("Cantidad de elementos:", response.count);
        const totalElements = response.count;
        this.totalPages = Math.ceil(totalElements / this.currentPageSize);
        //console.log("Total de páginas:", this.totalPages);
        this.getElementsPag();
      })
      .catch((error) => {
        console.error("Error al obtener la cantidad de elementos:", error);
      });
  }

  onPageChange(event: any) {
    //console.log("Evento de cambio de página:", event);
    this.currentPage = event;
    this.getElementsPag();
  }

  getElementsPag() {
    this.elements = [];
    const skip = this.currentPage * this.currentPageSize - this.currentPageSize;
    const limit = this.currentPageSize;

    firstValueFrom(
      this._globalService.Get(`pagos/paginated?skip=${skip}&limit=${limit}`)
    )
      .then((response: any) => {
        // console.log("Element os obtenidos:", response);
        this.elements = response;

      })
      .catch((error) => {
        console.error("Error al obtener los elementos:", error);
      });
  }

  ionViewDidLeave() {
    this.suscriptions.forEach((s) => s.unsubscribe());
  }
}
