export interface Prestamo {
  id?: number;
  idCliente?: number;
  idTipoPrestamo?: number;
  monto?: number;
  tasaInteres?: number;
  totalMonto?: number;
  fechaInicial?: string;
  fechaFinal?: string;
  estado?: boolean;
}