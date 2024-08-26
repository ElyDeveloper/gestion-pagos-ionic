import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FechasPagos, FechasPagosRelations, PlanesPago} from '../models';
import {PlanesPagoRepository} from './planes-pago.repository';

export class FechasPagosRepository extends DefaultCrudRepository<
  FechasPagos,
  typeof FechasPagos.prototype.id,
  FechasPagosRelations
> {

  public readonly planPago: BelongsToAccessor<PlanesPago, typeof FechasPagos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>,
  ) {
    super(FechasPagos, dataSource);
    this.planPago = this.createBelongsToAccessorFor('planPago', planesPagoRepositoryGetter,);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);
  }
}
