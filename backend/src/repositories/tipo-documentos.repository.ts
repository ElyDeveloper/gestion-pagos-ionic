import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {TipoDocumentos, TipoDocumentosRelations} from '../models';

export class TipoDocumentosRepository extends DefaultCrudRepository<
  TipoDocumentos,
  typeof TipoDocumentos.prototype.id,
  TipoDocumentosRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(TipoDocumentos, dataSource);
  }
}
