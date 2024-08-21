import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Nacionalidades, NacionalidadesRelations} from '../models';

export class NacionalidadesRepository extends DefaultCrudRepository<
  Nacionalidades,
  typeof Nacionalidades.prototype.id,
  NacionalidadesRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Nacionalidades, dataSource);
  }
}
