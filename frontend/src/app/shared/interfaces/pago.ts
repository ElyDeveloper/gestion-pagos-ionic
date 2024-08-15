import { Prestamos } from "./prestamo";

export interface Pagos {
  id?: number;
  fechaPago: string;
  monto: number;
  estado: boolean;
  idPrestamo: number;
  prestamos?: Prestamos;
  [prop: string]: any;
}