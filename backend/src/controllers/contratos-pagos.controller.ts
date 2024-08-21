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
import {ContratosPago} from '../models';
import {ContratosPagoRepository} from '../repositories';

export class ContratosPagosController {
  constructor(
    @repository(ContratosPagoRepository)
    public contratosPagoRepository : ContratosPagoRepository,
  ) {}

  @post('/contratos-pagos')
  @response(200, {
    description: 'ContratosPago model instance',
    content: {'application/json': {schema: getModelSchemaRef(ContratosPago)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosPago, {
            title: 'NewContratosPago',
            exclude: ['id'],
          }),
        },
      },
    })
    contratosPago: Omit<ContratosPago, 'id'>,
  ): Promise<ContratosPago> {
    return this.contratosPagoRepository.create(contratosPago);
  }

  @get('/contratos-pagos/count')
  @response(200, {
    description: 'ContratosPago model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ContratosPago) where?: Where<ContratosPago>,
  ): Promise<Count> {
    return this.contratosPagoRepository.count(where);
  }

  @get('/contratos-pagos')
  @response(200, {
    description: 'Array of ContratosPago model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ContratosPago, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<ContratosPago[]> {
    return this.contratosPagoRepository.find();
  }

  @patch('/contratos-pagos')
  @response(200, {
    description: 'ContratosPago PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosPago, {partial: true}),
        },
      },
    })
    contratosPago: ContratosPago,
    @param.where(ContratosPago) where?: Where<ContratosPago>,
  ): Promise<Count> {
    return this.contratosPagoRepository.updateAll(contratosPago, where);
  }

  @get('/contratos-pagos/{id}')
  @response(200, {
    description: 'ContratosPago model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ContratosPago, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ContratosPago, {exclude: 'where'}) filter?: FilterExcludingWhere<ContratosPago>
  ): Promise<ContratosPago> {
    return this.contratosPagoRepository.findById(id, filter);
  }

  @patch('/contratos-pagos/{id}')
  @response(204, {
    description: 'ContratosPago PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosPago, {partial: true}),
        },
      },
    })
    contratosPago: ContratosPago,
  ): Promise<void> {
    await this.contratosPagoRepository.updateById(id, contratosPago);
  }

  @put('/contratos-pagos/{id}')
  @response(204, {
    description: 'ContratosPago PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() contratosPago: ContratosPago,
  ): Promise<void> {
    await this.contratosPagoRepository.replaceById(id, contratosPago);
  }

  @del('/contratos-pagos/{id}')
  @response(204, {
    description: 'ContratosPago DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.contratosPagoRepository.deleteById(id);
  }
}
