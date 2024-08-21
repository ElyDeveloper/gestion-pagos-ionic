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
import {TransaccionesExternas} from '../models';
import {TransaccionesExternasRepository} from '../repositories';

export class TransaccionesExternasController {
  constructor(
    @repository(TransaccionesExternasRepository)
    public transaccionesExternasRepository : TransaccionesExternasRepository,
  ) {}

  @post('/transacciones-externas')
  @response(200, {
    description: 'TransaccionesExternas model instance',
    content: {'application/json': {schema: getModelSchemaRef(TransaccionesExternas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransaccionesExternas, {
            title: 'NewTransaccionesExternas',
            
          }),
        },
      },
    })
    transaccionesExternas: TransaccionesExternas,
  ): Promise<TransaccionesExternas> {
    return this.transaccionesExternasRepository.create(transaccionesExternas);
  }

  @get('/transacciones-externas/count')
  @response(200, {
    description: 'TransaccionesExternas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TransaccionesExternas) where?: Where<TransaccionesExternas>,
  ): Promise<Count> {
    return this.transaccionesExternasRepository.count(where);
  }

  @get('/transacciones-externas')
  @response(200, {
    description: 'Array of TransaccionesExternas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TransaccionesExternas, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<TransaccionesExternas[]> {
    return this.transaccionesExternasRepository.find({
      include: [{relation: 'fechasPagos'}]
    });
  }

  @get('/transacciones-externas/paginated')
  @response(200, {
    description: 'TransaccionesExternas model instance',
    content: {'application/json': {schema: getModelSchemaRef(TransaccionesExternas)}},
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ):Promise<TransaccionesExternas[]>{
    return this.transaccionesExternasRepository.find({
      include: [{relation: 'fechasPagos'}],
      skip: skip,
      limit: limit
    });
  }

  @patch('/transacciones-externas')
  @response(200, {
    description: 'TransaccionesExternas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransaccionesExternas, {partial: true}),
        },
      },
    })
    transaccionesExternas: TransaccionesExternas,
    @param.where(TransaccionesExternas) where?: Where<TransaccionesExternas>,
  ): Promise<Count> {
    return this.transaccionesExternasRepository.updateAll(transaccionesExternas, where);
  }

  @get('/transacciones-externas/{id}')
  @response(200, {
    description: 'TransaccionesExternas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TransaccionesExternas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<TransaccionesExternas> {
    return this.transaccionesExternasRepository.findById(id, 
      {include: [{relation: 'fechasPagos'}]}
    );
  }

  @patch('/transacciones-externas/{id}')
  @response(204, {
    description: 'TransaccionesExternas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransaccionesExternas, {partial: true}),
        },
      },
    })
    transaccionesExternas: TransaccionesExternas,
  ): Promise<void> {
    await this.transaccionesExternasRepository.updateById(id, transaccionesExternas);
  }

  @put('/transacciones-externas/{id}')
  @response(204, {
    description: 'TransaccionesExternas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() transaccionesExternas: TransaccionesExternas,
  ): Promise<void> {
    await this.transaccionesExternasRepository.replaceById(id, transaccionesExternas);
  }

  @del('/transacciones-externas/{id}')
  @response(204, {
    description: 'TransaccionesExternas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.transaccionesExternasRepository.deleteById(id);
  }
}
