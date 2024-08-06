import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class FormModels {
  private fb: FormBuilder;

  constructor(formBuilder: FormBuilder) {
    this.fb = formBuilder;
  }

  clienteForm(): FormGroup {
    return this.fb.group({
      Id: [null],
      DNI: ["", Validators.required],
      Nombres: ["", Validators.required],
      Apellidos: ["", Validators.required],
      Cel: ["", Validators.required],
      Direccion: ["", Validators.required],
      Email: ["", [Validators.required, Validators.email]],
      FechaIngreso: ["", Validators.required],
      FechaBaja: [null],
      Estado: [true],
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
      Id: [null],
      IdPrestamo: [null, Validators.required],
      FechaPago: ["", Validators.required],
      Monto: [null, [Validators.required, Validators.min(0)]],
      Estado: [true],
    });
  }

  prestamoForm(): FormGroup {
    return this.fb.group({
      Id: [null],
      IdCliente: [null, Validators.required],
      IdTipoPrestamo: [null, Validators.required],
      Monto: [null, [Validators.required, Validators.min(0)]],
      TasaInteres: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      TotalMonto: [null, [Validators.required, Validators.min(0)]],
      FechaInicial: ["", Validators.required],
      FechaFinal: ["", Validators.required],
      Estado: [true],
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
      Id: [null],
      Nombre: ["", Validators.required],
      Estado: [true],
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
