import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Documentos, DocumentosRelations, DocumentosTipoDoc} from '../models';
import { DocumentosTipoDocRepository } from './documentos-tipo-doc.repository';

export class DocumentosRepository extends DefaultCrudRepository<
  Documentos,
  typeof Documentos.prototype.id,
  DocumentosRelations
> {
  public readonly documentosTipoDoc: BelongsToAccessor<DocumentosTipoDoc, typeof DocumentosTipoDoc.prototype.id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('DocumentosTipoDocRepository') protected documentosTipoDocRepositoryGetter: Getter<DocumentosTipoDocRepository>,
  ) {
    super(Documentos, dataSource);

    this.documentosTipoDoc = this.createBelongsToAccessorFor('documentosTipoDoc', documentosTipoDocRepositoryGetter);
    this.registerInclusionResolver('documentosTipoDoc', this.documentosTipoDoc.inclusionResolver);
  }
}
