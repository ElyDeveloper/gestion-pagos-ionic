import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Clientes } from './Clientes.model';
import { TipoPrestamos } from './tipo-prestamos.model';
import { Cuotas } from './Cuotas.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Prestamos'}}})
export class Prestamos extends Entity {
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

  // @property({
  //   type: 'number',
  //   required: true,
  //   jsonSchema: {nullable: false},
  //   precision: 10,
  //   scale: 0,
  //   generated: false,
  //   mssql: {columnName: 'IdTipoPrestamo', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  // })
  // idTipoPrestamo: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 2,
    generated: false,
    mssql: {columnName: 'Monto', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'NO', generated: false},
  })
  monto: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 2,
    generated: false,
    mssql: {columnName: 'TasaInteres', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'NO', generated: false},
  })
  tasaInteres: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 2,
    generated: false,
    mssql: {columnName: 'TotalMonto', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'NO', generated: false},
  })
  totalMonto: number;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaInicial', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaInicial: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaFinal', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaFinal: string;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;

  // @property({
  //   type: 'number',
  //   jsonSchema: {nullable: true},
  //   precision: 10,
  //   scale: 0,
  //   generated: false,
  //   mssql: {columnName: 'IdCuotas', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES', generated: false},
  // })
  // idCuotas?: number;

  // Define well-known properties here
  @belongsTo(() => Clientes, {name: 'cliente'})
  IdCliente: number;

  @belongsTo(() => TipoPrestamos, {name: 'tipoPrestamo'})
  IdTipoPrestamo: number;

  @belongsTo(() => Cuotas, {name: 'cuotas'})
  IdCuotas: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Prestamos>) {
    super(data);
  }
}

export interface PrestamosRelations {
  // describe navigational properties here
}

export type PrestamosWithRelations = Prestamos & PrestamosRelations;