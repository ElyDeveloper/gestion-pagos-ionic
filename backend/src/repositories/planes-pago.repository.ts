import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {PlanesPago, PlanesPagoRelations} from '../models';

export class PlanesPagoRepository extends DefaultCrudRepository<
  PlanesPago,
  typeof PlanesPago.prototype.id,
  PlanesPagoRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(PlanesPago, dataSource);
  }
}
