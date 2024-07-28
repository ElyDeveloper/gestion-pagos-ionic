export interface Usuario {
  id?: number;
  rolid?: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  observacion?: string;
  ad?: boolean;
  correo?: string;
  tipoUsuario?: number;
  estado?: boolean;
  changedPassword?: boolean;
}