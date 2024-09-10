import { EstadoCivil } from "./estado-civil";
import { Nacionalidades } from "./nacionalidad";
import { RecordCrediticio } from "./record-crediticio";
import { TipoPersonas } from "./tipo-persona";


export interface Personas {
  id?: number;
  dni?: string;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
  cel: string;
  direccion: string;
  email: string;
  fechaIngreso: string;
  fechaBaja?: string;
  estado: boolean;
  idNacionalidad: number;
  idRecordCrediticio: number;
  idEstadoCivil: number;
  idTipoPersona: number;
  idEncrypted?:string;


  // Optional properties for related entities
  nacionalidad?: Nacionalidades;
  recordCrediticio?: RecordCrediticio;
  estadoCivil?: EstadoCivil;
  tipoPersona?: TipoPersonas;

  // Indexer signature for additional properties
  [prop: string]: any;
}
