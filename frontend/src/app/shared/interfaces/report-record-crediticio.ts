// export Interfaces para los elementos del encabezado
export interface Encabezado {
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
export interface Cuerpo {
  idPrestamo: number;
  fechaVencimiento: string;
  fechaCancelacion: string;
  diasAtraso: number;
  capital: number;
  interes: number;
  mora: number;
  total: number;
}

// export Interfaces para los elementos del pie
export interface Pie {
  idPrestamo: number;
  fecha: string;
  plazo: string;
  monto: number;
  asesor: string;
  tasa: number;
  tipo: string;
}

// export Interface principal que engloba todas las secciones
export interface InformePrestamo {
  encabezados: Encabezado[];
  cuerpo: Cuerpo[];
  pie: Pie[];
}