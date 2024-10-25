import {Entity, model, property, belongsTo, hasMany, hasOne} from '@loopback/repository';
import {Personas} from './personas.model';
import {Productos} from './productos.model';
import {PlanesPago} from './planes-pago.model';
import {Monedas} from './monedas.model';
import {PeriodosCobro} from './periodos-cobro.model';
import { EstadosInternos } from './estados-internos.model';

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
    mssql: {columnName: 'FechaSolicitud', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaSolicitud: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'FechaAprobacion', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  fechaAprobacion?: string | null;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;
  
  @belongsTo(() => Personas, {name: 'cliente'})
  idCliente: number;

  @belongsTo(() => Productos, {name: 'producto'})
  idProducto: number;

  @belongsTo(() => PlanesPago, {name: 'planPago'})
  idPlan: number;

  @belongsTo(() => Monedas, {name: 'moneda'})
  idMoneda: number;

  @belongsTo(() => PeriodosCobro, {name: 'periodoCobro'})
  idPeriodoCobro: number;

  @belongsTo(() => EstadosInternos, {name: 'estadoInterno'})
  idEstadoInterno: number;

  @belongsTo(() => Personas, {name: 'aval'})
  idAval: number;

  @hasOne(() => Personas, {keyTo: 'id'})
  clientePrestamo: Personas;
  // Define well-known properties here

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
