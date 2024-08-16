import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Clientes, Moras, MorasRelations} from '../models';
import { ClientesRepository } from './clientes.repository';

export class MorasRepository extends DefaultCrudRepository<
  Moras,
  typeof Moras.prototype.id,
  MorasRelations
> {
  public readonly cliente: BelongsToAccessor<Clientes, typeof Moras.prototype.Id>; 
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>,
  ) {
    super(Moras, dataSource);
    this.cliente = this.createBelongsToAccessorFor('cliente', clientesRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
