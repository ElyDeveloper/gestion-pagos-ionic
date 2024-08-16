import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Moras, MorasRelations} from '../models';

export class MorasRepository extends DefaultCrudRepository<
  Moras,
  typeof Moras.prototype.id,
  MorasRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Moras, dataSource);
  }
}
