import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Pagos, PagosRelations, Prestamos, FechasPagos, DocumentosTipoDoc} from '../models';
import {FechasPagosRepository} from './fechas-pagos.repository';
import {DocumentosTipoDocRepository} from './documentos-tipo-doc.repository';

export class PagosRepository extends DefaultCrudRepository<
  Pagos,
  typeof Pagos.prototype.id,
  PagosRelations
> {
  public readonly prestamos: BelongsToAccessor<Prestamos,typeof Prestamos.prototype.id>;

  public readonly cuota: BelongsToAccessor<FechasPagos, typeof Pagos.prototype.id>;

  public readonly documentosTipoDoc: HasOneRepositoryFactory<DocumentosTipoDoc, typeof Pagos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('FechasPagosRepository') protected fechasPagosRepositoryGetter: Getter<FechasPagosRepository>, @repository.getter('DocumentosTipoDocRepository') protected documentosTipoDocRepositoryGetter: Getter<DocumentosTipoDocRepository>,
  ) {
    super(Pagos, dataSource);
    this.documentosTipoDoc = this.createHasOneRepositoryFactoryFor('documentosTipoDoc', documentosTipoDocRepositoryGetter);
    this.registerInclusionResolver('documentosTipoDoc', this.documentosTipoDoc.inclusionResolver);
    this.cuota = this.createBelongsToAccessorFor('cuota', fechasPagosRepositoryGetter,);
    this.registerInclusionResolver('cuota', this.cuota.inclusionResolver);

  }
}
