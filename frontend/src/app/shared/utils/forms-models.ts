import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class FormModels {
  private fb: FormBuilder;

  constructor(formBuilder: FormBuilder) {
    this.fb = formBuilder;
  }

  clienteForm(): FormGroup {
    return this.fb.group({
      id: [null],
      dni: ["", Validators.required],
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required],
      cel: ["", Validators.required],
      direccion: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      fechaIngreso: ["", Validators.required],
      fechaBaja: [undefined],
      estado: [true],
    });
  }

  codigoVerificacionForm(): FormGroup {
    return this.fb.group({
      id: [null],
      userId: [null, Validators.required],
      codigo: ["", Validators.required],
      exp: ["", Validators.required],
    });
  }

  credencialForm(): FormGroup {
    return this.fb.group({
      id: [null],
      correo: ["", [Validators.required, Validators.email]],
      username: ["", Validators.required],
      hash: ["", Validators.required],
    });
  }

  pagoForm(): FormGroup {
    return this.fb.group({
      id: [null],
      idPrestamo: [null, Validators.required],
      fechaPago: ["", Validators.required],
      monto: [null, [Validators.required, Validators.min(0)]],
      estado: [true],
    });
  }

  prestamoForm(): FormGroup {
    return this.fb.group({
      // id: [null],
      monto: [null, [Validators.required, Validators.min(0)]],
      tasaInteres: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      totalMonto: [null, [Validators.required, Validators.min(0)]],
      fechaSolicitud: [null, Validators.required],
      fechaAprobacion: [null],
      estado: [true],
      idCliente: [null],
      idProducto: [null, Validators.required],
      idPeriodoCobro: [null, Validators.required],
      idEstadoAprobacion: [null, Validators.required],
      idPlan: [null],
      idMoneda: [null, Validators.required],
    });
  }

  planesPagoForm(): FormGroup {
    return this.fb.group({
      // id: [null],
      cuotasPagar: [null, [Validators.required, Validators.min(1)]],
      fechaInicio: [null, Validators.required],
      fechaFin: [null, { disabled: true }],
      cuotaPagadas: [0, [Validators.required, Validators.min(0)]],
      estado: [true],
    });
  }

  rolForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ["", Validators.required],
      descripcion: [""],
      estado: ["", Validators.required],
    });
  }

  tipoPrestamoForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ["", Validators.required],
      estado: [true],
    });
  }

  usuarioForm(): FormGroup {
    return this.fb.group({
      id: [null],
      rolid: [null, Validators.required],
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      telefono: ["", Validators.required],
      observacion: [""],
      ad: [false],
      correo: ["", [Validators.required]],
      estado: [true],
      changedPassword: [false],
    });
  }

  resetPswdForm(): FormGroup {
    return this.fb.group({
      identificator: ["", Validators.required],
      newPassword: ["", Validators.required],
    });
  }
}
