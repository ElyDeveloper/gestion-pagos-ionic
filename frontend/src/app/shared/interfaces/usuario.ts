import { Rol } from "./rol";

export interface Usuario {
  id?: number;
  rolid?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  observacion?: string;
  ad?: boolean;
  correo?: string;
  estado?: boolean;
  changedPassword?: boolean;
  rolesUsuario?:Rol;
}