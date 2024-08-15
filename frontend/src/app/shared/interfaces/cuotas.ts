import { Prestamos } from "./prestamo";

export interface Cuotas {
  id?: number;
  cuotas: number;
  estado?: boolean;
  prestamos?: Prestamos[];
  [prop: string]: any;
}