import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FechasPagos, FechasPagosRelations, PlanesPago, Pagos, Moras} from '../models';
import {PlanesPagoRepository} from './planes-pago.repository';
import {PagosRepository} from './pagos.repository';
import {MorasRepository} from './moras.repository';

export class FechasPagosRepository extends DefaultCrudRepository<
  FechasPagos,
  typeof FechasPagos.prototype.id,
  FechasPagosRelations
> {

  public readonly planPago: BelongsToAccessor<PlanesPago, typeof FechasPagos.prototype.id>;

  public readonly pagos: HasManyRepositoryFactory<Pagos, typeof FechasPagos.prototype.id>;

  public readonly moras: HasOneRepositoryFactory<Moras, typeof FechasPagos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>, @repository.getter('PagosRepository') protected pagosRepositoryGetter: Getter<PagosRepository>, @repository.getter('MorasRepository') protected morasRepositoryGetter: Getter<MorasRepository>,
  ) {
    super(FechasPagos, dataSource);
    this.moras = this.createHasOneRepositoryFactoryFor('moras', morasRepositoryGetter);
    this.registerInclusionResolver('moras', this.moras.inclusionResolver);
    this.pagos = this.createHasManyRepositoryFactoryFor('pagos', pagosRepositoryGetter,);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);
    this.planPago = this.createBelongsToAccessorFor('planPago', planesPagoRepositoryGetter,);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);
  }
}
