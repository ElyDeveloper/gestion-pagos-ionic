import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Clientes, ClientesRelations, Prestamos} from '../models';
import { PrestamosRepository } from './Prestamos.repository';

export class ClientesRepository extends DefaultCrudRepository<
  Clientes,
  typeof Clientes.prototype.id,
  ClientesRelations
> {
  public readonly prestamos: HasManyRepositoryFactory<Prestamos, typeof Clientes.prototype.Id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>,
  ) {
    super(Clientes, dataSource);
    this.prestamos = this.createHasManyRepositoryFactoryFor('prestamos', prestamosRepositoryGetter);
    this.registerInclusionResolver('prestamos', this.prestamos.inclusionResolver);
  }
}
