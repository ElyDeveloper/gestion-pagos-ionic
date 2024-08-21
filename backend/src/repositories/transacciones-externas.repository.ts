import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {FechasPagos, TransaccionesExternas, TransaccionesExternasRelations} from '../models';
import { FechasPagosRepository } from './fechas-pagos.repository';

export class TransaccionesExternasRepository extends DefaultCrudRepository<
  TransaccionesExternas,
  typeof TransaccionesExternas.prototype.id,
  TransaccionesExternasRelations
> {
  public readonly fechasPagos: BelongsToAccessor<FechasPagos, typeof FechasPagos.prototype.id>
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('FechasPagosRepository') protected FechasPagosRepositoryGetter: Getter<FechasPagosRepository>,
  ) {
    super(TransaccionesExternas, dataSource);
    this.fechasPagos = this.createBelongsToAccessorFor('fechasPagos', FechasPagosRepositoryGetter);
    this.registerInclusionResolver('fechasPagos', this.fechasPagos.inclusionResolver);
  }
}
