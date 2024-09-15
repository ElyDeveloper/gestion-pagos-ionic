export interface Cartera {
  IdPersona: number;
  nombreCliente: string;
  celular: string;
  diaPago: string;
  montoOtorgado: number;
  saldoCapitalActual: number;
  saldoActual: number;
  valorCuota: number;
  plazo: number;
  meses: number;
  tasa: number;
  cuotasPagadas: number;
  valorTotal: number;
  valorCuotasAtrasadas: number;
  diasEnMora: number;
  totalMora: number;
  fechaVencimiento: Date;
  mora: number;
}