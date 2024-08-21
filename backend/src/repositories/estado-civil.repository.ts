import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {EstadoCivil, EstadoCivilRelations} from '../models';

export class EstadoCivilRepository extends DefaultCrudRepository<
  EstadoCivil,
  typeof EstadoCivil.prototype.id,
  EstadoCivilRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(EstadoCivil, dataSource);
  }
}
