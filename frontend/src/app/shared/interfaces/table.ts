export interface Table {
  columns: Column[];
  rows: Row[];
}

export interface Column{
  key: string;
  alias: string;
  type?: string;
}

export interface Row {
  [key: string]: any;
}
