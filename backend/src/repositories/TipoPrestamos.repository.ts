import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoPrestamos, TipoPrestamosRelations} from '../models';
import { Prestamos } from '../models';
import { PrestamosRepository } from './Prestamos.repository';

export class TipoPrestamosRepository extends DefaultCrudRepository<
  TipoPrestamos,
  typeof TipoPrestamos.prototype.id,
  TipoPrestamosRelations
> {
  public readonly prestamos: HasManyRepositoryFactory<Prestamos, typeof TipoPrestamos.prototype.Id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>, 
  ) {
    super(TipoPrestamos, dataSource);
    this.prestamos = this.createHasManyRepositoryFactoryFor('prestamos', prestamosRepositoryGetter);
    this.registerInclusionResolver('prestamos', this.prestamos.inclusionResolver);
  }
}
