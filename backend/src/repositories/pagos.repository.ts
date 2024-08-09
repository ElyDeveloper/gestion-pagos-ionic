import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Pagos, PagosRelations, Prestamos} from '../models';
import { PrestamosRepository } from './prestamos.repository';

export class PagosRepository extends DefaultCrudRepository<
  Pagos,
  typeof Pagos.prototype.id,
  PagosRelations
> {
  public readonly prestamos: BelongsToAccessor<Prestamos,typeof Prestamos.prototype.id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>,
  ) {
    super(Pagos, dataSource);

    this.prestamos = this.createBelongsToAccessorFor('prestamos', prestamosRepositoryGetter);
    this.registerInclusionResolver('prestamos', this.prestamos.inclusionResolver);
  }
}
