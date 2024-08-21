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
  RecordCrediticio,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasRecordCrediticioController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/record-crediticio', {
    responses: {
      '200': {
        description: 'RecordCrediticio belonging to Personas',
        content: {
          'application/json': {
            schema: getModelSchemaRef(RecordCrediticio),
          },
        },
      },
    },
  })
  async getRecordCrediticio(
    @param.path.number('id') id: typeof Personas.prototype.id,
  ): Promise<RecordCrediticio> {
    return this.personasRepository.recordCrediticio(id);
  }
}
