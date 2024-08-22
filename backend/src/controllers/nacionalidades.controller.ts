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
import {Nacionalidades} from '../models';
import {NacionalidadesRepository} from '../repositories';

export class NacionalidadesController {
  constructor(
    @repository(NacionalidadesRepository)
    public nacionalidadesRepository: NacionalidadesRepository,
  ) {}

  @post('/nacionalidades')
  @response(200, {
    description: 'Nacionalidades model instance',
    content: {'application/json': {schema: getModelSchemaRef(Nacionalidades)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nacionalidades, {
            title: 'NewNacionalidades',
            exclude: ['id'],
          }),
        },
      },
    })
    nacionalidades: Omit<Nacionalidades, 'id'>,
  ): Promise<Nacionalidades> {
    return this.nacionalidadesRepository.create(nacionalidades);
  }

  @get('/nacionalidades/count')
  @response(200, {
    description: 'Nacionalidades model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Nacionalidades) where?: Where<Nacionalidades>,
  ): Promise<Count> {
    return this.nacionalidadesRepository.count(where);
  }

  @get('/nacionalidades')
  @response(200, {
    description: 'Array of Nacionalidades model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Nacionalidades, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Nacionalidades[]> {
    return this.nacionalidadesRepository.find();
  }

  @patch('/nacionalidades')
  @response(200, {
    description: 'Nacionalidades PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nacionalidades, {partial: true}),
        },
      },
    })
    nacionalidades: Nacionalidades,
    @param.where(Nacionalidades) where?: Where<Nacionalidades>,
  ): Promise<Count> {
    return this.nacionalidadesRepository.updateAll(nacionalidades, where);
  }

  @get('/nacionalidades/{id}')
  @response(200, {
    description: 'Nacionalidades model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Nacionalidades, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Nacionalidades, {exclude: 'where'})
    filter?: FilterExcludingWhere<Nacionalidades>,
  ): Promise<Nacionalidades> {
    return this.nacionalidadesRepository.findById(id, filter);
  }

  @patch('/nacionalidades/{id}')
  @response(204, {
    description: 'Nacionalidades PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nacionalidades, {partial: true}),
        },
      },
    })
    nacionalidades: Nacionalidades,
  ): Promise<void> {
    await this.nacionalidadesRepository.updateById(id, nacionalidades);
  }

  @put('/nacionalidades/{id}')
  @response(204, {
    description: 'Nacionalidades PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() nacionalidades: Nacionalidades,
  ): Promise<void> {
    await this.nacionalidadesRepository.replaceById(id, nacionalidades);
  }

  @del('/nacionalidades/{id}')
  @response(204, {
    description: 'Nacionalidades DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.nacionalidadesRepository.deleteById(id);
  }
}
