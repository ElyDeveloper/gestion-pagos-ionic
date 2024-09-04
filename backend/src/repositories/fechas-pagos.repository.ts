import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FechasPagos, FechasPagosRelations, PlanesPago, Pagos} from '../models';
import {PlanesPagoRepository} from './planes-pago.repository';
import {PagosRepository} from './pagos.repository';

export class FechasPagosRepository extends DefaultCrudRepository<
  FechasPagos,
  typeof FechasPagos.prototype.id,
  FechasPagosRelations
> {

  public readonly planPago: BelongsToAccessor<PlanesPago, typeof FechasPagos.prototype.id>;

  public readonly pagos: HasManyRepositoryFactory<Pagos, typeof FechasPagos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>, @repository.getter('PagosRepository') protected pagosRepositoryGetter: Getter<PagosRepository>,
  ) {
    super(FechasPagos, dataSource);
    this.pagos = this.createHasManyRepositoryFactoryFor('pagos', pagosRepositoryGetter,);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);
    this.planPago = this.createBelongsToAccessorFor('planPago', planesPagoRepositoryGetter,);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);
  }
}
