import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FechasPagos, FechasPagosRelations} from '../models';

export class FechasPagosRepository extends DefaultCrudRepository<
  FechasPagos,
  typeof FechasPagos.prototype.id,
  FechasPagosRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(FechasPagos, dataSource);
  }
}
