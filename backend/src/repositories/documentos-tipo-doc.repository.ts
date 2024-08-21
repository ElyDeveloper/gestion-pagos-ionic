import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
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
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('TipoDocumentosRepository') protected tipoDocumentosRepositoryGetter: Getter<TipoDocumentosRepository>,
    @repository.getter('PagosRepository') protected pagosRepositoryGetter: Getter<PagosRepository>,
  ) {
    super(DocumentosTipoDoc, dataSource);

    this.tipoDocumentos = this.createBelongsToAccessorFor('tipoDocumentos', tipoDocumentosRepositoryGetter);
    this.registerInclusionResolver('tipoDocumentos', this.tipoDocumentos.inclusionResolver);

    this.pagos = this.createBelongsToAccessorFor('pagos', pagosRepositoryGetter);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);

  }
}
