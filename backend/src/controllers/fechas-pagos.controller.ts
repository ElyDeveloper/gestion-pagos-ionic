import {
  Count,
  CountSchema,
  DataObject,
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
import {FechasPagos} from '../models';
import {FechasPagosRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

// @authenticate('jwt')
export class FechasPagosController {
  constructor(
    @repository(FechasPagosRepository)
    public FechasPagosRepository: FechasPagosRepository,
  ) {}

  @post('/fechas-pagos')
  @response(200, {
    description: 'FechasPagos model instance',
    content: {'application/json': {schema: getModelSchemaRef(FechasPagos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FechasPagos, {
            title: 'NewHistorialPagos',
          }),
        },
      },
    })
    fechasPagos: FechasPagos,
  ): Promise<FechasPagos> {
    return this.FechasPagosRepository.create(fechasPagos);
  }

  @get('/fechas-pagos/count')
  @response(200, {
    description: 'FechasPagos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FechasPagos) where?: Where<FechasPagos>,
  ): Promise<Count> {
    return this.FechasPagosRepository.count(where);
  }

  @get('/fechas-pagos')
  @response(200, {
    description: 'Array of FechasPagos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FechasPagos, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<FechasPagos[]> {
    return this.FechasPagosRepository.find({
      include: [{relation: 'planPago'}],
    });
  }

  @patch('/fechas-pagos')
  @response(200, {
    description: 'HistorialPagos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FechasPagos, {partial: true}),
        },
      },
    })
    fechasPagos: FechasPagos,
    @param.where(FechasPagos) where?: Where<FechasPagos>,
  ): Promise<Count> {
    return this.FechasPagosRepository.updateAll(fechasPagos, where);
  }

  @get('/fechas-pagos/paginated')
  @response(200, {
    description: 'List of FechasPagos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FechasPagos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<FechasPagos[]> {
    return this.FechasPagosRepository.find({
      include: [{relation: 'planPago'}],
      skip,
      limit,
    });
  }

  @get('/fechas-pagos/{id}')
  @response(200, {
    description: 'FechasPagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FechasPagos, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<FechasPagos> {
    return this.FechasPagosRepository.findById(id, {
      include: [{relation: 'planPago'}],
    });
  }

  @get('/fechas-pagos/plan/{id}')
  @response(200, {
    description: 'FechasPagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FechasPagos, {includeRelations: true}),
      },
    },
  })
  async findByIdPlan(
    @param.path.number('id') id: number,
  ): Promise<FechasPagos[]> {
    return await this.FechasPagosRepository.find({
      where: {planId: id},
      include: ['planPago', 'moras', {
        relation: 'pagos',
        scope: {
          order: ['id DESC'],
        },
      }],
      order: ['fechaPago ASC'],

    });
  }

  @get('/fechas-pagos/moras')
  @response(200, {
    description: 'FechasPagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FechasPagos, {includeRelations: true}),
      },
    },
  })
  async findMoras(): Promise<any> {
    return this.FechasPagosRepository.execute(`sp_ConsultarFechasPagos`);
  }

  @patch('/fechas-pagos/{id}')
  @response(204, {
    description: 'FechasPagos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FechasPagos, {partial: true}),
        },
      },
    })
    fechasPagos: FechasPagos,
  ): Promise<void> {
    await this.FechasPagosRepository.updateById(id, fechasPagos);
  }

  @put('/fechas-pagos/{id}')
  @response(204, {
    description: 'FechasPagos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() fechasPagos: FechasPagos,
  ): Promise<void> {
    await this.FechasPagosRepository.replaceById(id, fechasPagos);
  }

  @del('/fechas-pagos/{id}')
  @response(204, {
    description: 'FechasPagos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.FechasPagosRepository.deleteById(id);
  }
}
