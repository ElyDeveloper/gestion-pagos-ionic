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
  Nacionalidades,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasNacionalidadesController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/nacionalidades', {
    responses: {
      '200': {
        description: 'Nacionalidades belonging to Personas',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Nacionalidades),
          },
        },
      },
    },
  })
  async getNacionalidades(
    @param.path.number('id') id: typeof Personas.prototype.id,
  ): Promise<Nacionalidades> {
    return this.personasRepository.nacionalidad(id);
  }
}
