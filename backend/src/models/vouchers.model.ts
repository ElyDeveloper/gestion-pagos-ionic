import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Pagos } from './pagos.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Vouchers'}}})
export class Vouchers extends Entity {
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
    length: 100,
    generated: false,
    mssql: {columnName: 'NumeroVoucher', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  numeroVoucher: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaVoucher', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaVoucher: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: -1,
    generated: false,
    mssql: {columnName: 'Contenido', dataType: 'varchar', dataLength: -1, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  contenido: string;

  // Define well-known properties here
  @belongsTo(() => Pagos, {name: 'pagos'})
  idPago: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Vouchers>) {
    super(data);
  }
}

export interface VouchersRelations {
  // describe navigational properties here
}

export type VouchersWithRelations = Vouchers & VouchersRelations;
