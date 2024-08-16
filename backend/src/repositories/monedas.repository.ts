import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Monedas, MonedasRelations} from '../models';

export class MonedasRepository extends DefaultCrudRepository<
  Monedas,
  typeof Monedas.prototype.id,
  MonedasRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Monedas, dataSource);
  }
}
