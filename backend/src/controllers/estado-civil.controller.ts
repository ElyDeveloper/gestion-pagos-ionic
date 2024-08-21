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
import {EstadoCivil} from '../models';
import {EstadoCivilRepository} from '../repositories';

export class EstadoCivilController {
  constructor(
    @repository(EstadoCivilRepository)
    public estadoCivilRepository : EstadoCivilRepository,
  ) {}

  @post('/estado-civil')
  @response(200, {
    description: 'EstadoCivil model instance',
    content: {'application/json': {schema: getModelSchemaRef(EstadoCivil)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadoCivil, {
            title: 'NewEstadoCivil',
            
          }),
        },
      },
    })
    estadoCivil: EstadoCivil,
  ): Promise<EstadoCivil> {
    return this.estadoCivilRepository.create(estadoCivil);
  }

  @get('/estado-civil/count')
  @response(200, {
    description: 'EstadoCivil model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(EstadoCivil) where?: Where<EstadoCivil>,
  ): Promise<Count> {
    return this.estadoCivilRepository.count(where);
  }

  @get('/estado-civil')
  @response(200, {
    description: 'Array of EstadoCivil model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(EstadoCivil, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<EstadoCivil[]> {
    return this.estadoCivilRepository.find();
  }

  @patch('/estado-civil')
  @response(200, {
    description: 'EstadoCivil PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadoCivil, {partial: true}),
        },
      },
    })
    estadoCivil: EstadoCivil,
    @param.where(EstadoCivil) where?: Where<EstadoCivil>,
  ): Promise<Count> {
    return this.estadoCivilRepository.updateAll(estadoCivil, where);
  }

  @get('/estado-civil/{id}')
  @response(200, {
    description: 'EstadoCivil model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(EstadoCivil, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(EstadoCivil, {exclude: 'where'}) filter?: FilterExcludingWhere<EstadoCivil>
  ): Promise<EstadoCivil> {
    return this.estadoCivilRepository.findById(id, filter);
  }

  @patch('/estado-civil/{id}')
  @response(204, {
    description: 'EstadoCivil PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EstadoCivil, {partial: true}),
        },
      },
    })
    estadoCivil: EstadoCivil,
  ): Promise<void> {
    await this.estadoCivilRepository.updateById(id, estadoCivil);
  }

  @put('/estado-civil/{id}')
  @response(204, {
    description: 'EstadoCivil PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() estadoCivil: EstadoCivil,
  ): Promise<void> {
    await this.estadoCivilRepository.replaceById(id, estadoCivil);
  }

  @del('/estado-civil/{id}')
  @response(204, {
    description: 'EstadoCivil DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.estadoCivilRepository.deleteById(id);
  }
}
