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
import {Monedas} from '../models';
import {MonedasRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class MonedasController {
  constructor(
    @repository(MonedasRepository)
    public monedasRepository : MonedasRepository,
  ) {}

  @post('/monedas')
  @response(200, {
    description: 'Monedas model instance',
    content: {'application/json': {schema: getModelSchemaRef(Monedas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Monedas, {
            title: 'NewMonedas',
            
          }),
        },
      },
    })
    monedas: Monedas,
  ): Promise<Monedas> {
    return this.monedasRepository.create(monedas);
  }

  @get('/monedas/count')
  @response(200, {
    description: 'Monedas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Monedas) where?: Where<Monedas>,
  ): Promise<Count> {
    return this.monedasRepository.count(where);
  }

  @get('/monedas')
  @response(200, {
    description: 'Array of Monedas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Monedas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Monedas) filter?: Filter<Monedas>,
  ): Promise<Monedas[]> {
    return this.monedasRepository.find(filter);
  }

  @patch('/monedas')
  @response(200, {
    description: 'Monedas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Monedas, {partial: true}),
        },
      },
    })
    monedas: Monedas,
    @param.where(Monedas) where?: Where<Monedas>,
  ): Promise<Count> {
    return this.monedasRepository.updateAll(monedas, where);
  }

  @get('/monedas/{id}')
  @response(200, {
    description: 'Monedas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Monedas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Monedas, {exclude: 'where'}) filter?: FilterExcludingWhere<Monedas>
  ): Promise<Monedas> {
    return this.monedasRepository.findById(id, filter);
  }

  @patch('/monedas/{id}')
  @response(204, {
    description: 'Monedas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Monedas, {partial: true}),
        },
      },
    })
    monedas: Monedas,
  ): Promise<void> {
    await this.monedasRepository.updateById(id, monedas);
  }

  @put('/monedas/{id}')
  @response(204, {
    description: 'Monedas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() monedas: Monedas,
  ): Promise<void> {
    await this.monedasRepository.replaceById(id, monedas);
  }

  @del('/monedas/{id}')
  @response(204, {
    description: 'Monedas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.monedasRepository.deleteById(id);
  }
}
