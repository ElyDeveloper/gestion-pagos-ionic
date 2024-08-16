import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Documentos, DocumentosRelations} from '../models';

export class DocumentosRepository extends DefaultCrudRepository<
  Documentos,
  typeof Documentos.prototype.id,
  DocumentosRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(Documentos, dataSource);
  }
}
