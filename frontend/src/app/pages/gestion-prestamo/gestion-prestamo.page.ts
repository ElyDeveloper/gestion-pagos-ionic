import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  Subject,
} from "rxjs";
import { Clientes } from "src/app/shared/interfaces/cliente";
import { EstadosAprobacion } from "src/app/shared/interfaces/estado-aprobacion";
import { Monedas } from "src/app/shared/interfaces/moneda";
import { PeriodosCobro } from "src/app/shared/interfaces/periodo-cobro";
import { PlanesPago } from "src/app/shared/interfaces/plan-pago";
import { Prestamos } from "src/app/shared/interfaces/prestamo";
import { Productos } from "src/app/shared/interfaces/producto";
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
  productos: Productos[] = [];
  periodosCobro: PeriodosCobro[] = [];
  estadosAprobacion: EstadosAprobacion[] = [];
  monedas: Monedas[] = [];
  clientes: Clientes[] = [];

  clienteSeleccionado: any = {};
  prestamoSeleccionado: any = {};

  isModalOpen = false;
  isToastOpen = false;
  isEdit = false;

  searchClient: string = "";
  searchTerm$ = new Subject<string>();

  modalSelected: TemplateRef<any> = this.modalPlanPago;
  formSelected: FormGroup;

  private _globalService = inject(GlobalService);
  private _route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    this.formModels = new FormModels(this.fb);
    this.prestamoForm = this.formModels.prestamoForm();
    this.planesPagoForm = this.formModels.planesPagoForm();
    this.formSelected = this.planesPagoForm;
  }

  ngOnInit() {
    this.initSearcher();
    this.getInfoSelects();
    this.getPrestamo();
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
              this.prestamoSeleccionado = prestamo;
              this.clienteSeleccionado = prestamo.cliente;
              console.log("Plan de Pago: ", prestamo.planPago);
              this.prestamoForm.patchValue(prestamo);
              this.planesPagoForm.patchValue(prestamo.planPago);
              this.isEdit = true;
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.prestamoSeleccionado = null;
        this.isEdit = false;
        this.initValuesForm();
      }
    });
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
    const endpoints = [
      { key: "productos", setter: (data: any) => (this.productos = data) },
      {
        key: "periodos-cobros",
        setter: (data: any) => (this.periodosCobro = data),
      },
      {
        key: "estados-aprobacions",
        setter: (data: any) => (this.estadosAprobacion = data),
      },
      { key: "monedas", setter: (data: any) => (this.monedas = data) },
    ];

    endpoints.forEach((endpoint) => {
      this.fetchData(endpoint.key, endpoint.setter);
    });
  }

  private fetchData(endpoint: string, setter: (data: any) => void) {
    this._globalService.Get(endpoint).subscribe({
      next: (response: any) => {
        setter(response);
        console.log(`${endpoint} obtenidos:`, response);
      },
      error: (error) => {
        console.error(`Error al obtener ${endpoint}:`, error);
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
      const planPago = this.createPlanPago();

      if (this.isEdit) {
        this.updatePrestamo(planPago);
      } else {
        this.savePrestamo(planPago);
      }
    }
  }

  private createPlanPago(): PlanesPago {
    return {
      cuotasPagar: this.planesPagoForm.get("cuotasPagar")?.value,
      fechaInicio: new Date(
        this.planesPagoForm.get("fechaInicio")?.value || new Date()
      ),
      fechaFin: this.planesPagoForm.get("fechaFin")?.value,
      cuotaPagadas: 0,
      estado: this.planesPagoForm.get("estado")?.value,
    };
  }

  private createPrestamo(idPlan: number): Prestamos {
    return {
      monto: this.prestamoForm.get("monto")?.value,
      tasaInteres: this.prestamoForm.get("tasaInteres")?.value,
      totalMonto: this.prestamoForm.get("totalMonto")?.value,
      fechaSolicitud: new Date(
        this.prestamoForm.get("fechaSolicitud")?.value || new Date()
      ),
      fechaAprobacion: this.prestamoForm.get("fechaAprobacion")?.value || null,
      estado: this.prestamoForm.get("estado")?.value,
      idCliente: this.clienteSeleccionado.id,
      idProducto: this.prestamoForm.get("idProducto")?.value,
      idPeriodoCobro: this.prestamoForm.get("idPeriodoCobro")?.value,
      idEstadoAprobacion: this.prestamoForm.get("idEstadoAprobacion")?.value,
      idPlan: idPlan,
      idMoneda: this.prestamoForm.get("idMoneda")?.value,
    };
  }

  private updatePrestamo(planPago: PlanesPago) {
    const idPlan = this.prestamoSeleccionado.planPago.id;
    const idPrestamo = this.prestamoSeleccionado.id;

    this._globalService.PutId("planes-pagos", idPlan, planPago).subscribe({
      next: () => {
        const prestamo = this.createPrestamo(idPlan);
        console.log("Prestamo a guardar: ", prestamo);
        this._globalService.PutId("prestamos", idPrestamo, prestamo).subscribe({
          next: this.handlePrestamoSuccess.bind(this),
          error: this.handlePrestamoError.bind(this),
        });
      },
      error: this.handlePrestamoError.bind(this),
    });
  }

  private savePrestamo(planPago: PlanesPago) {
    this._globalService.Post("planes-pagos", planPago).subscribe({
      next: (response: any) => {
        const prestamo = this.createPrestamo(response.id);
        this._globalService.Post("prestamos", prestamo).subscribe({
          next: this.handlePrestamoSuccess.bind(this),
          error: this.handlePrestamoError.bind(this),
        });
      },
      error: this.handlePrestamoError.bind(this),
    });
  }

  private handlePrestamoSuccess(response: any) {
    console.log("Operación de préstamo exitosa:", response);
    this.isModalOpen = false;
    this.isEdit = false;
    this.cleanForms();
    this.initValuesForm();
    this.currentStep = 0;
  }

  private handlePrestamoError(error: any) {
    console.error("Error en la operación de préstamo:", error);
    // TODO: Mostrar mensaje de error al usuario
    this.isModalOpen = false;
    this.isEdit = false;
    this.initValuesForm();
    this.currentStep = 0;
  }
}