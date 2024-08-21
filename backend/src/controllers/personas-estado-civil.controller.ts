import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Personas,
  EstadoCivil,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasEstadoCivilController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/estado-civil', {
    responses: {
      '200': {
        description: 'EstadoCivil belonging to Personas',
        content: {
          'application/json': {
            schema: getModelSchemaRef(EstadoCivil),
          },
        },
      },
    },
  })
  async getEstadoCivil(
    @param.path.number('id') id: typeof Personas.prototype.id,
  ): Promise<EstadoCivil> {
    return this.personasRepository.estadoCivil(id);
  }
}
