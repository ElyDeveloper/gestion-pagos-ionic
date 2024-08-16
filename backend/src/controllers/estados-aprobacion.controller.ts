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
import {EstadosAprobacion} from '../models';
import {EstadosAprobacionRepository} from '../repositories';

export class EstadosAprobacionController {
  constructor(
    @repository(EstadosAprobacionRepository)
    public estadosAprobacionRepository : EstadosAprobacionRepository,
  ) {}

  @post('/estados-aprobacions')
  @response(200, {
    description: 'EstadosAprobacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(EstadosAprobacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadosAprobacion, {
            title: 'NewEstadosAprobacion',
            
          }),
        },
      },
    })
    estadosAprobacion: EstadosAprobacion,
  ): Promise<EstadosAprobacion> {
    return this.estadosAprobacionRepository.create(estadosAprobacion);
  }

  @get('/estados-aprobacions/count')
  @response(200, {
    description: 'EstadosAprobacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(EstadosAprobacion) where?: Where<EstadosAprobacion>,
  ): Promise<Count> {
    return this.estadosAprobacionRepository.count(where);
  }

  @get('/estados-aprobacions')
  @response(200, {
    description: 'Array of EstadosAprobacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(EstadosAprobacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(EstadosAprobacion) filter?: Filter<EstadosAprobacion>,
  ): Promise<EstadosAprobacion[]> {
    return this.estadosAprobacionRepository.find(filter);
  }

  @patch('/estados-aprobacions')
  @response(200, {
    description: 'EstadosAprobacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadosAprobacion, {partial: true}),
        },
      },
    })
    estadosAprobacion: EstadosAprobacion,
    @param.where(EstadosAprobacion) where?: Where<EstadosAprobacion>,
  ): Promise<Count> {
    return this.estadosAprobacionRepository.updateAll(estadosAprobacion, where);
  }

  @get('/estados-aprobacions/{id}')
  @response(200, {
    description: 'EstadosAprobacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(EstadosAprobacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(EstadosAprobacion, {exclude: 'where'}) filter?: FilterExcludingWhere<EstadosAprobacion>
  ): Promise<EstadosAprobacion> {
    return this.estadosAprobacionRepository.findById(id, filter);
  }

  @patch('/estados-aprobacions/{id}')
  @response(204, {
    description: 'EstadosAprobacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadosAprobacion, {partial: true}),
        },
      },
    })
    estadosAprobacion: EstadosAprobacion,
  ): Promise<void> {
    await this.estadosAprobacionRepository.updateById(id, estadosAprobacion);
  }

  @put('/estados-aprobacions/{id}')
  @response(204, {
    description: 'EstadosAprobacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() estadosAprobacion: EstadosAprobacion,
  ): Promise<void> {
    await this.estadosAprobacionRepository.replaceById(id, estadosAprobacion);
  }

  @del('/estados-aprobacions/{id}')
  @response(204, {
    description: 'EstadosAprobacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.estadosAprobacionRepository.deleteById(id);
  }
}
