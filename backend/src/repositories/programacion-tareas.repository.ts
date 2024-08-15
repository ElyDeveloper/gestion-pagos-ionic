import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {ProgramacionTareas, ProgramacionTareasRelations} from '../models';

export class ProgramacionTareasRepository extends DefaultCrudRepository<
  ProgramacionTareas,
  typeof ProgramacionTareas.prototype.id,
  ProgramacionTareasRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(ProgramacionTareas, dataSource);
  }
}
