import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {LimiteCuotas, LimiteCuotasRelations} from '../models';

export class LimiteCuotasRepository extends DefaultCrudRepository<
  LimiteCuotas,
  typeof LimiteCuotas.prototype.id,
  LimiteCuotasRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(LimiteCuotas, dataSource);
  }
}
