export interface Prestamo {
  Id?: number;
  IdCliente?: number;
  IdTipoPrestamo?: number;
  Monto?: number;
  TasaInteres?: number;
  TotalMonto?: number;
  FechaInicial?: string;
  FechaFinal?: string;
  Estado?: boolean;
}