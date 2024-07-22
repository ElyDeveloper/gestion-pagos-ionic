export interface Table {
  columns: Column[];
  rows: Row[];
}

export interface Column{
  key: string;
  alias: string;
}

export interface Row {
  [key: string]: any;
}
