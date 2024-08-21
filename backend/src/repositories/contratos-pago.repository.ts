import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {ContratosPago, ContratosPagoRelations} from '../models';

export class ContratosPagoRepository extends DefaultCrudRepository<
  ContratosPago,
  typeof ContratosPago.prototype.id,
  ContratosPagoRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(ContratosPago, dataSource);
  }
}
