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
  TipoPersonas,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasTipoPersonasController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/tipo-personas', {
    responses: {
      '200': {
        description: 'TipoPersonas belonging to Personas',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TipoPersonas),
          },
        },
      },
    },
  })
  async getTipoPersonas(
    @param.path.number('id') id: typeof Personas.prototype.id,
  ): Promise<TipoPersonas> {
    return this.personasRepository.tipoPersona(id);
  }
}
