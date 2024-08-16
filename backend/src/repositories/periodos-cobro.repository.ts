import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {PeriodosCobro, PeriodosCobroRelations} from '../models';

export class PeriodosCobroRepository extends DefaultCrudRepository<
  PeriodosCobro,
  typeof PeriodosCobro.prototype.id,
  PeriodosCobroRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(PeriodosCobro, dataSource);
  }
}
