import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {RecordCrediticio, RecordCrediticioRelations} from '../models';

export class RecordCrediticioRepository extends DefaultCrudRepository<
  RecordCrediticio,
  typeof RecordCrediticio.prototype.id,
  RecordCrediticioRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(RecordCrediticio, dataSource);
  }
}
