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
import {PeriodosCobro} from '../models';
import {PeriodosCobroRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class PeriodosCobroController {
  constructor(
    @repository(PeriodosCobroRepository)
    public periodosCobroRepository : PeriodosCobroRepository,
  ) {}

  @post('/periodos-cobros')
  @response(200, {
    description: 'PeriodosCobro model instance',
    content: {'application/json': {schema: getModelSchemaRef(PeriodosCobro)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PeriodosCobro, {
            title: 'NewPeriodosCobro',
            
          }),
        },
      },
    })
    periodosCobro: PeriodosCobro,
  ): Promise<PeriodosCobro> {
    return this.periodosCobroRepository.create(periodosCobro);
  }

  @get('/periodos-cobros/count')
  @response(200, {
    description: 'PeriodosCobro model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PeriodosCobro) where?: Where<PeriodosCobro>,
  ): Promise<Count> {
    return this.periodosCobroRepository.count(where);
  }

  @get('/periodos-cobros')
  @response(200, {
    description: 'Array of PeriodosCobro model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PeriodosCobro, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<PeriodosCobro[]> {
    return this.periodosCobroRepository.find();
  }

  @patch('/periodos-cobros')
  @response(200, {
    description: 'PeriodosCobro PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PeriodosCobro, {partial: true}),
        },
      },
    })
    periodosCobro: PeriodosCobro,
    @param.where(PeriodosCobro) where?: Where<PeriodosCobro>,
  ): Promise<Count> {
    return this.periodosCobroRepository.updateAll(periodosCobro, where);
  }

  @get('/periodos-cobros/{id}')
  @response(200, {
    description: 'PeriodosCobro model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PeriodosCobro, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<PeriodosCobro> {
    return this.periodosCobroRepository.findById(id);
  }

  @patch('/periodos-cobros/{id}')
  @response(204, {
    description: 'PeriodosCobro PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PeriodosCobro, {partial: true}),
        },
      },
    })
    periodosCobro: PeriodosCobro,
  ): Promise<void> {
    await this.periodosCobroRepository.updateById(id, periodosCobro);
  }

  @put('/periodos-cobros/{id}')
  @response(204, {
    description: 'PeriodosCobro PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() periodosCobro: PeriodosCobro,
  ): Promise<void> {
    await this.periodosCobroRepository.replaceById(id, periodosCobro);
  }

  @del('/periodos-cobros/{id}')
  @response(204, {
    description: 'PeriodosCobro DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.periodosCobroRepository.deleteById(id);
  }
}
