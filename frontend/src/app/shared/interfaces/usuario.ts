import { Roles } from "./rol";
import { UsuarioCliente } from "./usuario-cliente";

export interface Usuario {
  id?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  observacion?: string;
  ad?: boolean;
  correo?: string;
  estado?: boolean;
  changedPassword: boolean;
  rolid: number;
  rol?: Roles;
  usuarioClientes?: UsuarioCliente[];
  [prop: string]: any;
}