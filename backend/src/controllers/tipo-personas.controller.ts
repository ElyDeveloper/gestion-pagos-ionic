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
import {TipoPersonas} from '../models';
import {TipoPersonasRepository} from '../repositories';

export class TipoPersonasController {
  constructor(
    @repository(TipoPersonasRepository)
    public tipoPersonasRepository : TipoPersonasRepository,
  ) {}

  @post('/tipo-personas')
  @response(200, {
    description: 'TipoPersonas model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoPersonas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoPersonas, {
            title: 'NewTipoPersonas',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoPersonas: Omit<TipoPersonas, 'id'>,
  ): Promise<TipoPersonas> {
    return this.tipoPersonasRepository.create(tipoPersonas);
  }

  @get('/tipo-personas/count')
  @response(200, {
    description: 'TipoPersonas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoPersonas) where?: Where<TipoPersonas>,
  ): Promise<Count> {
    return this.tipoPersonasRepository.count(where);
  }

  @get('/tipo-personas')
  @response(200, {
    description: 'Array of TipoPersonas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoPersonas, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<TipoPersonas[]> {
    return this.tipoPersonasRepository.find();
  }

  @patch('/tipo-personas')
  @response(200, {
    description: 'TipoPersonas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoPersonas, {partial: true}),
        },
      },
    })
    tipoPersonas: TipoPersonas,
    @param.where(TipoPersonas) where?: Where<TipoPersonas>,
  ): Promise<Count> {
    return this.tipoPersonasRepository.updateAll(tipoPersonas, where);
  }

  @get('/tipo-personas/{id}')
  @response(200, {
    description: 'TipoPersonas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoPersonas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoPersonas, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoPersonas>
  ): Promise<TipoPersonas> {
    return this.tipoPersonasRepository.findById(id, filter);
  }

  @patch('/tipo-personas/{id}')
  @response(204, {
    description: 'TipoPersonas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoPersonas, {partial: true}),
        },
      },
    })
    tipoPersonas: TipoPersonas,
  ): Promise<void> {
    await this.tipoPersonasRepository.updateById(id, tipoPersonas);
  }

  @put('/tipo-personas/{id}')
  @response(204, {
    description: 'TipoPersonas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoPersonas: TipoPersonas,
  ): Promise<void> {
    await this.tipoPersonasRepository.replaceById(id, tipoPersonas);
  }

  @del('/tipo-personas/{id}')
  @response(204, {
    description: 'TipoPersonas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoPersonasRepository.deleteById(id);
  }
}
