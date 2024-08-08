export interface meterSchema {
  codigo: string;
  sourceId: number;
  descripcion: string;
  modelo: string;
  serie: string;
  lecturaMax: number;
  TipoMedidorId: number;
  observacion: string;
  puntoConexion: number;
  tipo: boolean;
  almacenamientoLocal: boolean;
  funcionalidad: boolean;
  estado: boolean;
}

export interface meterRelationSchema {
  id?: number;
  medidorId: number;
  sourceId: number;
  porcentaje: number;
  operacion: boolean;
  observacion: string;
  mostrar: boolean;
  estado: boolean;
}
