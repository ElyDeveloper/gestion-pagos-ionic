import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Prestamos,
  EstadosAprobacion,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosEstadosAprobacionController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/estados-aprobacion', {
    responses: {
      '200': {
        description: 'EstadosAprobacion belonging to Prestamos',
        content: {
          'application/json': {
            schema: getModelSchemaRef(EstadosAprobacion),
          },
        },
      },
    },
  })
  async getEstadosAprobacion(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
  ): Promise<EstadosAprobacion> {
    return this.prestamosRepository.estadoAprobacion(id);
  }
}
