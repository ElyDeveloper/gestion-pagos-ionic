import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {DocumentosTipoDoc, DocumentosTipoDocRelations} from '../models';

export class DocumentosTipoDocRepository extends DefaultCrudRepository<
  DocumentosTipoDoc,
  typeof DocumentosTipoDoc.prototype.id,
  DocumentosTipoDocRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(DocumentosTipoDoc, dataSource);
  }
}
