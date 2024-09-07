import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Documentos, DocumentosTipoDoc, DocumentosTipoDocRelations, Pagos, TipoDocumentos} from '../models';
import { TipoDocumentosRepository } from './tipo-documentos.repository';
import { DocumentosRepository } from './documentos.repository';
import { PagosRepository } from './pagos.repository';

export class DocumentosTipoDocRepository extends DefaultCrudRepository<
  DocumentosTipoDoc,
  typeof DocumentosTipoDoc.prototype.id,
  DocumentosTipoDocRelations
> {
  public readonly tipoDocumentos: BelongsToAccessor<TipoDocumentos, typeof TipoDocumentos.prototype.id>; 
  public readonly pagos: BelongsToAccessor<Pagos, typeof Pagos.prototype.id>;

  public readonly documentos: HasOneRepositoryFactory<Documentos, typeof DocumentosTipoDoc.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('TipoDocumentosRepository') protected tipoDocumentosRepositoryGetter: Getter<TipoDocumentosRepository>,
    @repository.getter('PagosRepository') protected pagosRepositoryGetter: Getter<PagosRepository>, @repository.getter('DocumentosRepository') protected documentosRepositoryGetter: Getter<DocumentosRepository>,
  ) {
    super(DocumentosTipoDoc, dataSource);
    this.documentos = this.createHasOneRepositoryFactoryFor('documentos', documentosRepositoryGetter);
    this.registerInclusionResolver('documentos', this.documentos.inclusionResolver);

    this.tipoDocumentos = this.createBelongsToAccessorFor('tipoDocumentos', tipoDocumentosRepositoryGetter);
    this.registerInclusionResolver('tipoDocumentos', this.tipoDocumentos.inclusionResolver);

    this.pagos = this.createBelongsToAccessorFor('pagos', pagosRepositoryGetter);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);

  }
}
