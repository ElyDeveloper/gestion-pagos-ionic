import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {EstadosInternos, EstadosInternosRelations} from '../models';

export class EstadosInternosRepository extends DefaultCrudRepository<
  EstadosInternos,
  typeof EstadosInternos.prototype.id,
  EstadosInternosRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(EstadosInternos, dataSource);
  }
}
