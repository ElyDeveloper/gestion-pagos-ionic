import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Nacionalidades'}}
})
export class Nacionalidades extends Entity {
  @property({
    type: 'number',
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mssql: {columnName: 'Id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 1},
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 50,
    generated: false,
    mssql: {columnName: 'Descripcion', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  descripcion: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 550,
    generated: false,
    mssql: {columnName: 'UrlBandera', dataType: 'varchar', dataLength: 550, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  urlBandera?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 10,
    generated: false,
    mssql: {columnName: 'Abreviatura', dataType: 'varchar', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  abreviatura: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 50,
    generated: false,
    mssql: {columnName: 'Gentilicio', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  gentilicio?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Nacionalidades>) {
    super(data);
  }
}

export interface NacionalidadesRelations {
  // describe navigational properties here
}

export type NacionalidadesWithRelations = Nacionalidades & NacionalidadesRelations;
