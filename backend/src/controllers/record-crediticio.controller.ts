import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {RecordCrediticio} from '../models';
import {RecordCrediticioRepository} from '../repositories';

export class RecordCrediticioController {
  constructor(
    @repository(RecordCrediticioRepository)
    public recordCrediticioRepository : RecordCrediticioRepository,
  ) {}

  @post('/record-crediticios')
  @response(200, {
    description: 'RecordCrediticio model instance',
    content: {'application/json': {schema: getModelSchemaRef(RecordCrediticio)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecordCrediticio, {
            title: 'NewRecordCrediticio',
            
          }),
        },
      },
    })
    recordCrediticio: RecordCrediticio,
  ): Promise<RecordCrediticio> {
    return this.recordCrediticioRepository.create(recordCrediticio);
  }

  @get('/record-crediticios/count')
  @response(200, {
    description: 'RecordCrediticio model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RecordCrediticio) where?: Where<RecordCrediticio>,
  ): Promise<Count> {
    return this.recordCrediticioRepository.count(where);
  }

  @get('/record-crediticios')
  @response(200, {
    description: 'Array of RecordCrediticio model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RecordCrediticio, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RecordCrediticio) filter?: Filter<RecordCrediticio>,
  ): Promise<RecordCrediticio[]> {
    return this.recordCrediticioRepository.find(filter);
  }

  @patch('/record-crediticios')
  @response(200, {
    description: 'RecordCrediticio PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecordCrediticio, {partial: true}),
        },
      },
    })
    recordCrediticio: RecordCrediticio,
    @param.where(RecordCrediticio) where?: Where<RecordCrediticio>,
  ): Promise<Count> {
    return this.recordCrediticioRepository.updateAll(recordCrediticio, where);
  }

  @get('/record-crediticios/{id}')
  @response(200, {
    description: 'RecordCrediticio model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RecordCrediticio, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RecordCrediticio, {exclude: 'where'}) filter?: FilterExcludingWhere<RecordCrediticio>
  ): Promise<RecordCrediticio> {
    return this.recordCrediticioRepository.findById(id, filter);
  }

  @patch('/record-crediticios/{id}')
  @response(204, {
    description: 'RecordCrediticio PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecordCrediticio, {partial: true}),
        },
      },
    })
    recordCrediticio: RecordCrediticio,
  ): Promise<void> {
    await this.recordCrediticioRepository.updateById(id, recordCrediticio);
  }

  @put('/record-crediticios/{id}')
  @response(204, {
    description: 'RecordCrediticio PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() recordCrediticio: RecordCrediticio,
  ): Promise<void> {
    await this.recordCrediticioRepository.replaceById(id, recordCrediticio);
  }

  @del('/record-crediticios/{id}')
  @response(204, {
    description: 'RecordCrediticio DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.recordCrediticioRepository.deleteById(id);
  }
}
