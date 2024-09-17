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
import {EstadosInternos} from '../models';
import {EstadosInternosRepository} from '../repositories';

export class EstadosInternosController {
  constructor(
    @repository(EstadosInternosRepository)
    public estadosInternosRepository : EstadosInternosRepository,
  ) {}

  @post('/estados-internos')
  @response(200, {
    description: 'EstadosInternos model instance',
    content: {'application/json': {schema: getModelSchemaRef(EstadosInternos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadosInternos, {
            title: 'NewEstadosInternos',
            exclude: ['id'],
          }),
        },
      },
    })
    estadosInternos: Omit<EstadosInternos, 'id'>,
  ): Promise<EstadosInternos> {
    return this.estadosInternosRepository.create(estadosInternos);
  }

  @get('/estados-internos/count')
  @response(200, {
    description: 'EstadosInternos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(EstadosInternos) where?: Where<EstadosInternos>,
  ): Promise<Count> {
    return this.estadosInternosRepository.count(where);
  }

  @get('/estados-internos')
  @response(200, {
    description: 'Array of EstadosInternos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(EstadosInternos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(EstadosInternos) filter?: Filter<EstadosInternos>,
  ): Promise<EstadosInternos[]> {
    return this.estadosInternosRepository.find(filter);
  }

  @patch('/estados-internos')
  @response(200, {
    description: 'EstadosInternos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadosInternos, {partial: true}),
        },
      },
    })
    estadosInternos: EstadosInternos,
    @param.where(EstadosInternos) where?: Where<EstadosInternos>,
  ): Promise<Count> {
    return this.estadosInternosRepository.updateAll(estadosInternos, where);
  }

  @get('/estados-internos/{id}')
  @response(200, {
    description: 'EstadosInternos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(EstadosInternos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(EstadosInternos, {exclude: 'where'}) filter?: FilterExcludingWhere<EstadosInternos>
  ): Promise<EstadosInternos> {
    return this.estadosInternosRepository.findById(id, filter);
  }

  @patch('/estados-internos/{id}')
  @response(204, {
    description: 'EstadosInternos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadosInternos, {partial: true}),
        },
      },
    })
    estadosInternos: EstadosInternos,
  ): Promise<void> {
    await this.estadosInternosRepository.updateById(id, estadosInternos);
  }

  @put('/estados-internos/{id}')
  @response(204, {
    description: 'EstadosInternos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() estadosInternos: EstadosInternos,
  ): Promise<void> {
    await this.estadosInternosRepository.replaceById(id, estadosInternos);
  }

  @del('/estados-internos/{id}')
  @response(204, {
    description: 'EstadosInternos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.estadosInternosRepository.deleteById(id);
  }
}
