export interface EncabezadoEstadoCuenta {
  nroPrestamo: number | string;
  codClientes: string;
  estadoPtmo: boolean | string;
  mtoPrestamo: number;
  saldoPtmo: number;
  SaldoTotPtmo: number;
  asesor: number | string;
  nombreAsesor: string;
  tMora: string;
  fDesembolso: string;
  producto: string;
  cuota: number;
  plazo: number | string;
  Periodo: string;
  direccion: string;
  telefono: string;
  mora: number;
  totalSTotales: number;
}

export interface PagosEfectuados {
  nCuota: number;
  FechaPago: string;
  Monto: number;
  capital: number;
  intCorrientes: number;
  montoTotal: number;
  mora: number;
  sdoCapital: number;
  total: number;
}

export interface SaldoEstadoCuenta {
  nCuota: number;
  capital: number;
  cuota: number;
  dias: number;
  fechaVto: string;
  idPrestamo: number;
  intCorriente: number;
  intMora: number;
  totalSVigentes: number;
}
