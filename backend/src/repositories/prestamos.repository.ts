import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Clientes, Cuotas, Pagos, Prestamos, PrestamosRelations} from '../models';
import { ClientesRepository } from './clientes.repository';
import { TipoPrestamos } from '../models';
import { TipoPrestamosRepository } from './tipo-prestamos.repository';
import { CuotasRepository } from './cuotas.repository';
import { PagosRepository } from './pagos.repository';

export class PrestamosRepository extends DefaultCrudRepository<
  Prestamos,
  typeof Prestamos.prototype.id,
  PrestamosRelations
> {
  public readonly cliente: BelongsToAccessor<Clientes, typeof Prestamos.prototype.Id>;
  public readonly tipoPrestamo: BelongsToAccessor<TipoPrestamos, typeof Prestamos.prototype.Id>;
  public readonly cuota: BelongsToAccessor<Cuotas, typeof Prestamos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>,
    @repository.getter('TipoPrestamosRepository') protected tipoPrestamosRepositoryGetter: Getter<TipoPrestamosRepository>,
    @repository.getter('CuotasRepository') protected cuotasRepositoryGetter: Getter<CuotasRepository>,
  ) {
    super(Prestamos, dataSource);
    this.cliente = this.createBelongsToAccessorFor('cliente', clientesRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);

    this.tipoPrestamo = this.createBelongsToAccessorFor('tipoPrestamo', tipoPrestamosRepositoryGetter);
    this.registerInclusionResolver('tipoPrestamo', this.tipoPrestamo.inclusionResolver);

    this.cuota = this.createBelongsToAccessorFor('cuotas', cuotasRepositoryGetter);
    this.registerInclusionResolver('cuotas', this.cuota.inclusionResolver);
  }
}