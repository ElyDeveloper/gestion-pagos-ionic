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
  Personas,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosPersonasController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/personas', {
    responses: {
      '200': {
        description: 'Personas belonging to Prestamos',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Personas),
          },
        },
      },
    },
  })
  async getPersonas(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
  ): Promise<Personas> {
    return this.prestamosRepository.aval(id);
  }
}
