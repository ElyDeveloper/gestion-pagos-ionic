import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {PlanesPago, PlanesPagoRelations, Prestamos, FechasPagos} from '../models';
import {PrestamosRepository} from './prestamos.repository';
import {FechasPagosRepository} from './fechas-pagos.repository';

export class PlanesPagoRepository extends DefaultCrudRepository<
  PlanesPago,
  typeof PlanesPago.prototype.id,
  PlanesPagoRelations
> {

  public readonly prestamos: HasManyRepositoryFactory<Prestamos, typeof PlanesPago.prototype.id>;

  public readonly fechasPagos: HasManyRepositoryFactory<FechasPagos, typeof PlanesPago.prototype.id>;

  public readonly prestamo: HasOneRepositoryFactory<Prestamos, typeof PlanesPago.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>, @repository.getter('FechasPagosRepository') protected fechasPagosRepositoryGetter: Getter<FechasPagosRepository>,
  ) {
    super(PlanesPago, dataSource);
    this.prestamo = this.createHasOneRepositoryFactoryFor('prestamo', prestamosRepositoryGetter);
    this.registerInclusionResolver('prestamo', this.prestamo.inclusionResolver);
    this.fechasPagos = this.createHasManyRepositoryFactoryFor('fechasPagos', fechasPagosRepositoryGetter,);
    this.registerInclusionResolver('fechasPagos', this.fechasPagos.inclusionResolver);
    this.prestamos = this.createHasManyRepositoryFactoryFor('prestamos', prestamosRepositoryGetter,);
    this.registerInclusionResolver('prestamos', this.prestamos.inclusionResolver);
  }
}
