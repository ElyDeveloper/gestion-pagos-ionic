// export Interfaces para los elementos del encabezado
export interface EncabezadoRecordCrediticio {
  idPrestamo: number | string;
  cliente: string;
  direccion: string;
  telefono: string;
  asesor: string;
  producto: string;
  etapa: string;
  numeroTotalPtmos: number | string;
  fechaProceso: string;
  recordCrediticio: string;
  cantidadDesembolso: number | string;
}

// export Interfaces para los elementos del cuerpo
export interface CuerpoRecordCrediticio {
  idPrestamo: number;
  nCuota: number;
  fechaVencimiento: string;
  fechaCancelacion: string;
  dias: number;
  capital: number;
  intereses: number;
  mora: number;
  cuota: number;
  saldoCapital: number;
}

export interface PrestamoRecordCrediticio {
  idPrestamo: number;
  fecha: string;
  plazo: string;
  monto: number;
  asesor: string;
  tasa: number;
  tipo: string;
}

export interface PieRecordCrediticio {
  activos: PrestamoRecordCrediticio[];
  completados: PrestamoRecordCrediticio[];
}

// export Interface principal que engloba todas las secciones
export interface InformePrestamo {
  encabezados: EncabezadoRecordCrediticio[];
  cuerpo: CuerpoRecordCrediticio[];
  pie: PieRecordCrediticio[];
}
