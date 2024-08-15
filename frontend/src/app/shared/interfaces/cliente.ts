import { Prestamos } from "./prestamo";
import { UsuarioCliente } from "./usuario-cliente";

export interface Clientes {
  id?: number;
  dni?: string;
  nombres: string;
  apellidos: string;
  cel: string;
  direccion: string;
  email: string;
  fechaIngreso: string;
  fechaBaja?: string;
  estado: boolean;
  prestamos?: Prestamos[];
  usuarioCliente?: UsuarioCliente[];
  [prop: string]: any;
}