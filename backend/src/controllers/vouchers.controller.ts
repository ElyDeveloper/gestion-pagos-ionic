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
import {Vouchers} from '../models';
import {VouchersRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class VouchersController {
  constructor(
    @repository(VouchersRepository)
    public vouchersRepository : VouchersRepository,
  ) {}

  @post('/vouchers')
  @response(200, {
    description: 'Vouchers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vouchers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vouchers, {
            title: 'NewVouchers',
            
          }),
        },
      },
    })
    vouchers: Vouchers,
  ): Promise<Vouchers> {
    return this.vouchersRepository.create(vouchers);
  }

  @get('/vouchers/count')
  @response(200, {
    description: 'Vouchers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Vouchers) where?: Where<Vouchers>,
  ): Promise<Count> {
    return this.vouchersRepository.count(where);
  }

  @get('/vouchers')
  @response(200, {
    description: 'Array of Vouchers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vouchers, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Vouchers[]> {
    return this.vouchersRepository.find({
      include: [{relation: 'pagos'}],
    });
  }

  @patch('/vouchers')
  @response(200, {
    description: 'Vouchers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vouchers, {partial: true}),
        },
      },
    })
    vouchers: Vouchers,
    @param.where(Vouchers) where?: Where<Vouchers>,
  ): Promise<Count> {
    return this.vouchersRepository.updateAll(vouchers, where);
  }

  @get('/vouchers/{id}')
  @response(200, {
    description: 'Vouchers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vouchers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Vouchers> {
    return this.vouchersRepository.findById(id);
  }

  @patch('/vouchers/{id}')
  @response(204, {
    description: 'Vouchers PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vouchers, {partial: true}),
        },
      },
    })
    vouchers: Vouchers,
  ): Promise<void> {
    await this.vouchersRepository.updateById(id, vouchers);
  }

  @put('/vouchers/{id}')
  @response(204, {
    description: 'Vouchers PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() vouchers: Vouchers,
  ): Promise<void> {
    await this.vouchersRepository.replaceById(id, vouchers);
  }

  @del('/vouchers/{id}')
  @response(204, {
    description: 'Vouchers DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.vouchersRepository.deleteById(id);
  }
}
