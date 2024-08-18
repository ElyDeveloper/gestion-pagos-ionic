import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { GlobalService } from "src/app/shared/services/global.service";
import { FormModels } from "src/app/shared/utils/forms-models";

@Component({
  selector: "app-gestion-prestamo",
  templateUrl: "./gestion-prestamo.page.html",
  styleUrls: ["./gestion-prestamo.page.scss"],
})
export class GestionPrestamoPage implements OnInit {
  @ViewChild("modalPlanPago", { static: true })
  modalPlanPago!: TemplateRef<any>;

  steps = [1, 2, 3];
  currentStep = 0;

  formModels: FormModels;

  prestamoForm: FormGroup;
  planesPagoForm: FormGroup;
  productos: any[] = [];
  periodosCobro: any[] = [];
  estadosAprobacion: any[] = [];
  monedas: any[] = [];
  clientes: any[] = [];

  clienteSeleccionado: any = {};

  isModalOpen = false;
  isToastOpen = false;
  isEdit = false;

  searchClient: string = "";
  searchTerm$ = new Subject<string>();

  modalSelected: TemplateRef<any> = this.modalPlanPago;
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.prestamoForm = this.formModels.prestamoForm();
    this.planesPagoForm = this.formModels.planesPagoForm();
    this.formSelected = this.planesPagoForm;
  }

  ngOnInit() {
    this.initSearcher();
    this.getInfoSelects();
    this.initValuesForm();
  }

  calculateTotalMonto() {
    const monto = this.prestamoForm.get("monto")?.value;
    const tasa = this.prestamoForm.get("tasaInteres")?.value;

    if (monto && tasa) {
      const totalMonto = monto * (1 + tasa / 100);
      this.prestamoForm.get("totalMonto")?.setValue(totalMonto);
    }
    
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
  }

  isSuccessState(): boolean {
    return (
      this.clienteSeleccionado.id &&
      this.planesPagoForm.valid &&
      this.prestamoForm.valid
    );
  }

  isWarningState(): boolean {
    return (
      !this.clienteSeleccionado.id ||
      !this.planesPagoForm.valid ||
      !this.prestamoForm.valid
    );
  }

  initSearcher() {
    this.searchTerm$
      .pipe(
        debounceTime(800), // Espera 300 ms después de que el usuario deja de escribir
        distinctUntilChanged() // Asegura que solo se realice una búsqueda si el valor ha cambiado
      )
      .subscribe(() => {
        if (this.searchClient !== "") {
          this.searchData();
        } else {
          this.clientes = [];
        }
        // this.searchEmpleado(); // Llama a la función de búsqueda cuando se cumplan las condiciones
      });
  }

  getInfoSelects() {
    this._globalService.Get("productos").subscribe({
      next: (response: any) => {
        this.productos = response;
        console.log("Productos obtenidos:", response);
      },
      error: (error) => {
        console.error("Error al obtener productos:", error);
      },
    });

    this._globalService.Get("periodos-cobros").subscribe({
      next: (response: any) => {
        this.periodosCobro = response;
        console.log("Periodos de cobro obtenidos:", response);
      },
      error: (error) => {
        console.error("Error al obtener periodos de cobro:", error);
      },
    });

    this._globalService.Get("estados-aprobacions").subscribe({
      next: (response: any) => {
        this.estadosAprobacion = response;
        console.log("Estados de aprobación obtenidos:", response);
      },
      error: (error) => {
        console.error("Error al obtener estados de aprobación:", error);
      },
    });

    this._globalService.Get("monedas").subscribe({
      next: (response: any) => {
        this.monedas = response;
        console.log("Monedas obtenidas:", response);
      },
      error: (error) => {
        console.error("Error al obtener monedas:", error);
      },
    });
  }

  initValuesForm() {
    this.prestamoForm.get("idEstadoAprobacion")?.setValue(1);
  }

  searchData() {
    this._globalService
      .Get(`clientes/search?query=${this.searchClient}`)
      .subscribe({
        next: (response: any) => {
          this.clientes = response;
          console.log("Clientes obtenidos:", response);
        },
        error: (error) => {
          console.error("Error al obtener clientes:", error);
        },
      });
  }

  onClienteSeleccionado(event: any) {
    this.clienteSeleccionado = event.detail.value;
  }

  async handleSave(data: any) {
    if (this.isEdit) {
      // this.handleUserOperation("edit", data);
    } else if (!this.isEdit) {
      delete data.id;
      // this.handleUserOperation("create", data);
    }
  }

  searchValueChanged(event: any) {
    this.searchTerm$.next(event);
  }

  cleanForms() {
    this.planesPagoForm.reset();
    this.prestamoForm.reset();
    this.clienteSeleccionado = {};
    this.searchClient = "";
    this.isEdit = false;
    this.isModalOpen = false;
    this.modalSelected = this.modalPlanPago;
    this.formSelected = this.planesPagoForm;
    this.currentStep = 0;
  }

  setModalState(isEdit: boolean, modalTemplate: any, formData?: any) {
    this.isEdit = isEdit;

    if (isEdit && formData) {
      this.formSelected.patchValue(formData);
      // TODO: ESPECIFICO
      const fullName = `${formData.cliente.nombres.split(" ")[0]} ${
        formData.cliente.apellidos.split(" ")[0]
      }`;
      this.formSelected.get("idCliente")?.setValue(fullName);
      this.formSelected
        .get("idTipoPrestamo")
        ?.setValue(formData.tipoPrestamo.id);
    } else if (!isEdit) {
      // this.cleanForm();
    }

    this.modalSelected = modalTemplate;
    this.isModalOpen = true;
  }

  onSubmit() {
    if (this.prestamoForm.valid && this.planesPagoForm.valid) {
      // Implementar lógica para guardar el préstamo
      console.log(this.prestamoForm.value);
      console.log(this.planesPagoForm.value);

      //Primero guardamos el plan de pago
      this._globalService
        .Post("planes-pagos", this.planesPagoForm.value)
        .subscribe({
          next: (response: any) => {
            console.log("Plan de pago guardado con éxito:", response);

            this.prestamoForm.get('idCliente')?.setValue(this.clienteSeleccionado.id)
            this.prestamoForm.get('idPlan')?.setValue(response.id);
            // Luego guardamos el préstamo
            this._globalService
              .Post("prestamos", this.prestamoForm.value)
              .subscribe({
                next: (response: any) => {
                  console.log("Préstamo guardado con éxito:", response);
                  this.isModalOpen = false;
                  this.isEdit = false;
                  this.cleanForms();
                  this.initValuesForm();
                  this.currentStep = 0;
                },
                error: (error) => {
                  console.error("Error al guardar préstamo:", error);
                },
              });
          },
          error: (error) => {
            console.error("Error al guardar préstamo");
            console.error("Error al guardar plan de pago:", error);
            this.isModalOpen = false;
            this.isEdit = false;
            this.initValuesForm();
            this.currentStep = 0;
            // TODO: Mostrar mensaje de error al guardar el plan de pago
            // this.errorMessage = error.error.message;
          },
        });
    }
  }
}
