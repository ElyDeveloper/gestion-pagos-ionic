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
      id: [null],
      idCliente: [null, Validators.required],
      idTipoPrestamo: [null, Validators.required],
      monto: [null, [Validators.required, Validators.min(0)]],
      tasaInteres: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      totalMonto: [null, [Validators.required, Validators.min(0)]],
      fechaInicial: ["", Validators.required],
      fechaFinal: ["", Validators.required],
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
      correo: ["", [Validators.required, Validators.email]],
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