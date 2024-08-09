import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Cuotas, CuotasRelations, Prestamos} from '../models';
import { PrestamosRepository } from './prestamos.repository';

export class CuotasRepository extends DefaultCrudRepository<
  Cuotas,
  typeof Cuotas.prototype.id,
  CuotasRelations
> {
  public readonly prestamos: HasManyRepositoryFactory<Prestamos, typeof Cuotas.prototype.Id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>,
  ) {
    super(Cuotas, dataSource);
    this.prestamos = this.createHasManyRepositoryFactoryFor('prestamos', prestamosRepositoryGetter);
    this.registerInclusionResolver('prestamos', this.prestamos.inclusionResolver);
  }
}
