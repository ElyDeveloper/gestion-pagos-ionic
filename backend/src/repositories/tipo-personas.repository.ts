import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoPersonas, TipoPersonasRelations} from '../models';

export class TipoPersonasRepository extends DefaultCrudRepository<
  TipoPersonas,
  typeof TipoPersonas.prototype.id,
  TipoPersonasRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TipoPersonas, dataSource);
  }
}
