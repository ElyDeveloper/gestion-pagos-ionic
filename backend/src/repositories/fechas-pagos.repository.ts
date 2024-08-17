import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FechasPagos, FechasPagosRelations, PlanesPago} from '../models';
import { PlanesPagoRepository } from './planes-pago.repository';

export class FechasPagosRepository extends DefaultCrudRepository<
  FechasPagos,
  typeof FechasPagos.prototype.id,
  FechasPagosRelations
> {
  public readonly planPago: BelongsToAccessor<PlanesPago, typeof FechasPagos.prototype.id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PlanesPagoRepository') protected PlanesPagoRepositoryGetter: Getter<PlanesPagoRepository>,
  ) {
    super(FechasPagos, dataSource);
    this.planPago = this.createBelongsToAccessorFor('planPago', PlanesPagoRepositoryGetter);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);
  }
}
