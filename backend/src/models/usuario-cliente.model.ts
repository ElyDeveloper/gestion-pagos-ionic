import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Clientes } from './clientes.model';
import { number } from 'mathjs';
import { Usuario } from './usuarios.model';

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
  @belongsTo(() => Usuario, {name: 'Usuario'})
  usuarioId:number;
  
  @belongsTo(() => Clientes, {name: 'Cliente'})
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
