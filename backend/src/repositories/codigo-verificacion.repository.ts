import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {CodigoVerificacion, CodigoVerificacionRelations} from '../models';

export class CodigoVerificacionRepository extends DefaultCrudRepository<
  CodigoVerificacion,
  typeof CodigoVerificacion.prototype.id,
  CodigoVerificacionRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(CodigoVerificacion, dataSource);
  }
}
