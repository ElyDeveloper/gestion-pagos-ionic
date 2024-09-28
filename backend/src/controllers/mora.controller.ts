import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  relation,
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
import {Moras} from '../models';
import {MorasRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class MoraController {
  constructor(
    @repository(MorasRepository)
    public morasRepository : MorasRepository,
  ) {}

  @post('/moras')
  @response(200, {
    description: 'Moras model instance',
    content: {'application/json': {schema: getModelSchemaRef(Moras)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Moras, {
            title: 'NewMoras',
            
          }),
        },
      },
    })
    moras: Moras,
  ): Promise<Moras> {
    return this.morasRepository.create(moras);
  }

  @get('/moras/paginated')
  @response(200, {
    description: 'Moras model instance',
    content: {'application/json': {schema: getModelSchemaRef(Moras)}},
  })
  async dataPaginated(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ){
    return this.morasRepository.find({
      include:[
        {relation: 'cliente'},
        {relation: 'prestamo'},
        {relation: 'planPago'},
        {relation: 'fechaPago'},
      ],
      skip, 
      limit
    });
  }

  @get('/moras/count')
  @response(200, {
    description: 'Moras model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Moras) where?: Where<Moras>,
  ): Promise<Count> {
    return this.morasRepository.count(where);
  }

  @get('/moras')
  @response(200, {
    description: 'Array of Moras model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Moras, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Moras[]> {
    return this.morasRepository.find({
      include:[
        {relation: 'cliente'},
        {relation: 'prestamo'},
        {relation: 'planPago'},
        {relation: 'fechaPago'},
      ],
    }
    );
  }

  @get('/moras/fecha-pago/{id}')
  @response(200, {
    description: 'Moras model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Moras, {includeRelations: true}),
      },
    },
  })
  async findByIdFechaPago(
    @param.path.number('id') id: number,
  ): Promise<Moras[]> {
    //console.log('Buscando moras por fecha de pago:', id);
    return this.morasRepository.find({
      where: {idFechaPago: id},
    });
  }

  @patch('/moras')
  @response(200, {
    description: 'Moras PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Moras, {partial: true}),
        },
      },
    })
    moras: Moras,
    @param.where(Moras) where?: Where<Moras>,
  ): Promise<Count> {
    return this.morasRepository.updateAll(moras, where);
  }

  @get('/moras/{id}')
  @response(200, {
    description: 'Moras model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Moras, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<Moras> {
    return this.morasRepository.findById(id,{
      include:[
        {relation: 'cliente'},
        {relation: 'prestamo'},
        {relation: 'planPago'},
        {relation: 'fechaPago'},
      ],
    });
  }

  @patch('/moras/{id}')
  @response(204, {
    description: 'Moras PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Moras, {partial: true}),
        },
      },
    })
    moras: Moras,
  ): Promise<void> {
    await this.morasRepository.updateById(id, moras);
  }

  @put('/moras/{id}')
  @response(204, {
    description: 'Moras PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() moras: Moras,
  ): Promise<void> {
    await this.morasRepository.replaceById(id, moras);
  }

  @del('/moras/{id}')
  @response(204, {
    description: 'Moras DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.morasRepository.deleteById(id);
  }
}
