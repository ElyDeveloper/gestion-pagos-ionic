export interface Cliente {
  id?: number;
  dni?: string;
  nombres?: string;
  apellidos?: string;
  cel?: string;
  direccion?: string;
  email?: string;
  fechaIngreso?: string | Date;
  fechaBaja?: string | Date;
  estado?: boolean;
}