import { Entity, model, property, belongsTo } from '@loopback/repository';
import { number } from 'mathjs';
import { Usuario } from './usuarios.model';
import { Personas } from './personas.model';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'UsuarioCliente'}}
})
export class UsuarioCliente extends Entity {
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

  // Define well-known properties here
  @belongsTo(() => Usuario, {name: 'usuario'})
  usuarioId:number;
  
  @belongsTo(() => Personas, {name: 'cliente'})
  clienteId:number;
  
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UsuarioCliente>) {
    super(data);
  }
}

export interface UsuarioClienteRelations {
  // describe navigational properties here
}

export type UsuarioClienteWithRelations = UsuarioCliente & UsuarioClienteRelations;
