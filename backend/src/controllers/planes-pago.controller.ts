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
import {PlanesPago} from '../models';
import {PlanesPagoRepository} from '../repositories';

export class PlanesPagoController {
  constructor(
    @repository(PlanesPagoRepository)
    public planesPagoRepository: PlanesPagoRepository,
  ) {}

  @post('/planes-pagos')
  @response(200, {
    description: 'PlanesPago model instance',
    content: {'application/json': {schema: getModelSchemaRef(PlanesPago)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanesPago, {
            title: 'NewPlanesPago',
          }),
        },
      },
    })
    planesPago: Omit<PlanesPago, 'id'>,
  ): Promise<PlanesPago> {
    return this.planesPagoRepository.create(planesPago);
  }

  @get('/planes-pagos/count')
  @response(200, {
    description: 'PlanesPago model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PlanesPago) where?: Where<PlanesPago>,
  ): Promise<Count> {
    return this.planesPagoRepository.count(where);
  }

  @get('/planes-pagos')
  @response(200, {
    description: 'Array of PlanesPago model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PlanesPago, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<PlanesPago[]> {
    return this.planesPagoRepository.find();
  }

  @patch('/planes-pagos')
  @response(200, {
    description: 'PlanesPago PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanesPago, {partial: true}),
        },
      },
    })
    planesPago: PlanesPago,
    @param.where(PlanesPago) where?: Where<PlanesPago>,
  ): Promise<Count> {
    return this.planesPagoRepository.updateAll(planesPago, where);
  }

  @get('/planes-pagos/{id}')
  @response(200, {
    description: 'PlanesPago model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PlanesPago, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<PlanesPago> {
    return this.planesPagoRepository.findById(id);
  }

  @patch('/planes-pagos/{id}')
  @response(204, {
    description: 'PlanesPago PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanesPago, {partial: true}),
        },
      },
    })
    planesPago: PlanesPago,
  ): Promise<void> {
    await this.planesPagoRepository.updateById(id, planesPago);
  }

  @put('/planes-pagos/{id}')
  @response(204, {
    description: 'PlanesPago PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() planesPago: PlanesPago,
  ): Promise<void> {
    await this.planesPagoRepository.replaceById(id, planesPago);
  }

  @del('/planes-pagos/{id}')
  @response(204, {
    description: 'PlanesPago DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.planesPagoRepository.deleteById(id);
  }
}
