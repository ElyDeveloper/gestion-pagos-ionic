import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {ContratosPago, ContratosPagoRelations, Prestamos} from '../models';
import {PrestamosRepository} from './prestamos.repository';

export class ContratosPagoRepository extends DefaultCrudRepository<
  ContratosPago,
  typeof ContratosPago.prototype.id,
  ContratosPagoRelations
> {

  public readonly prestamo: BelongsToAccessor<Prestamos, typeof ContratosPago.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>,
  ) {
    super(ContratosPago, dataSource);
    this.prestamo = this.createBelongsToAccessorFor('prestamo', prestamosRepositoryGetter,);
    this.registerInclusionResolver('prestamo', this.prestamo.inclusionResolver);
  }
}
