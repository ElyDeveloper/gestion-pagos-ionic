import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {EstadosAprobacion, EstadosAprobacionRelations} from '../models';

export class EstadosAprobacionRepository extends DefaultCrudRepository<
  EstadosAprobacion,
  typeof EstadosAprobacion.prototype.id,
  EstadosAprobacionRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(EstadosAprobacion, dataSource);
  }
}
