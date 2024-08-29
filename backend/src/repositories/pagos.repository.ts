import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Pagos, PagosRelations, Prestamos, FechasPagos} from '../models';
import {FechasPagosRepository} from './fechas-pagos.repository';

export class PagosRepository extends DefaultCrudRepository<
  Pagos,
  typeof Pagos.prototype.id,
  PagosRelations
> {
  public readonly prestamos: BelongsToAccessor<Prestamos,typeof Prestamos.prototype.id>;

  public readonly cuota: BelongsToAccessor<FechasPagos, typeof Pagos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('FechasPagosRepository') protected fechasPagosRepositoryGetter: Getter<FechasPagosRepository>,
  ) {
    super(Pagos, dataSource);
    this.cuota = this.createBelongsToAccessorFor('cuota', fechasPagosRepositoryGetter,);
    this.registerInclusionResolver('cuota', this.cuota.inclusionResolver);

  }
}
