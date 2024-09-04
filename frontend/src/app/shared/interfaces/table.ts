export interface Action {
  alias: string;
  action: string;
  icon: string;
  color: string;
  rolesAuthorized?: number[];
}

export interface Table {
  columns: Column[];
  rows: Row[];
}

export interface Column {
  key: string;
  alias: string;
  type?: string;
  lstActions?: Action[];
  combineWith?: string; // Nueva propiedad para indicar combinación
  combineFormat?: (value1: any, value2: any) => string; // Función opcional para formatear la combinación
  texto?: string; // Nueva propiedad para adicionar texto
  addText?: (value1: any, value2: any) => string; //
  options?: string[];
  colorOptions?: string[];
  imageUrl?: string;
  propsVisibles?: string[]; // Nueva propiedad para
}

export interface Row {
  [key: string]: any;
}
