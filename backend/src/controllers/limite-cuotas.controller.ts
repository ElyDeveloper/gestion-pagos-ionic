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
import {LimiteCuotas} from '../models';
import {LimiteCuotasRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class LimiteCuotasController {
  constructor(
    @repository(LimiteCuotasRepository)
    public limiteCuotasRepository : LimiteCuotasRepository,
  ) {}

  @post('/limite-cuotas')
  @response(200, {
    description: 'LimiteCuotas model instance',
    content: {'application/json': {schema: getModelSchemaRef(LimiteCuotas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LimiteCuotas, {
            title: 'NewLimiteCuotas',
            
          }),
        },
      },
    })
    limiteCuotas: LimiteCuotas,
  ): Promise<LimiteCuotas> {
    return this.limiteCuotasRepository.create(limiteCuotas);
  }

  @get('/limite-cuotas/count')
  @response(200, {
    description: 'LimiteCuotas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LimiteCuotas) where?: Where<LimiteCuotas>,
  ): Promise<Count> {
    return this.limiteCuotasRepository.count(where);
  }

  @get('/limite-cuotas/paginated')
  @response(200, {
    description: 'LimiteCuotas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async dataPaginated(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ):Promise<LimiteCuotas[]>{
    return this.limiteCuotasRepository.find({
      skip: skip,
      limit: limit
    });
  }

  @get('/limite-cuotas')
  @response(200, {
    description: 'Array of LimiteCuotas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LimiteCuotas, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<LimiteCuotas[]> {
    return this.limiteCuotasRepository.find();
  }

  @patch('/limite-cuotas')
  @response(200, {
    description: 'LimiteCuotas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LimiteCuotas, {partial: true}),
        },
      },
    })
    limiteCuotas: LimiteCuotas,
    @param.where(LimiteCuotas) where?: Where<LimiteCuotas>,
  ): Promise<Count> {
    return this.limiteCuotasRepository.updateAll(limiteCuotas, where);
  }

  @get('/limite-cuotas/{id}')
  @response(200, {
    description: 'LimiteCuotas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LimiteCuotas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LimiteCuotas, {exclude: 'where'}) filter?: FilterExcludingWhere<LimiteCuotas>
  ): Promise<LimiteCuotas> {
    return this.limiteCuotasRepository.findById(id, filter);
  }

  @patch('/limite-cuotas/{id}')
  @response(204, {
    description: 'LimiteCuotas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LimiteCuotas, {partial: true}),
        },
      },
    })
    limiteCuotas: LimiteCuotas,
  ): Promise<void> {
    await this.limiteCuotasRepository.updateById(id, limiteCuotas);
  }

  @put('/limite-cuotas/{id}')
  @response(204, {
    description: 'LimiteCuotas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() limiteCuotas: LimiteCuotas,
  ): Promise<void> {
    await this.limiteCuotasRepository.replaceById(id, limiteCuotas);
  }

  @del('/limite-cuotas/{id}')
  @response(204, {
    description: 'LimiteCuotas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.limiteCuotasRepository.deleteById(id);
  }
}
