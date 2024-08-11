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
import {UsuarioCliente} from '../models';
import {UsuarioClienteRepository} from '../repositories';

export class UsuarioClienteController {
  constructor(
    @repository(UsuarioClienteRepository)
    public usuarioClienteRepository : UsuarioClienteRepository,
  ) {}

  @post('/usuario-clientes')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(UsuarioCliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {
            title: 'NewUsuarioCliente',
            
          }),
        },
      },
    })
    usuarioCliente: UsuarioCliente,
  ): Promise<UsuarioCliente> {
    return this.usuarioClienteRepository.create(usuarioCliente);
  }

  @get('/usuario-clientes/count')
  @response(200, {
    description: 'UsuarioCliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UsuarioCliente) where?: Where<UsuarioCliente>,
  ): Promise<Count> {
    return this.usuarioClienteRepository.count(where);
  }

  @get('/usuario-clientes')
  @response(200, {
    description: 'Array of UsuarioCliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UsuarioCliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<UsuarioCliente[]> {
    return this.usuarioClienteRepository.find({
      include: [
        {relation: 'Cliente'},
        {relation: 'Usuario'}
      ],
    });
  }

  @get('/usuario-clientes/paginated')
  @response(200, {
    description: 'List of UsuarioCliente model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UsuarioCliente, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginated(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ):Promise<UsuarioCliente[]> {
    return this.usuarioClienteRepository.find({
      include: [
        {relation: 'Cliente'},
        {relation: 'Usuario'}
      ],
      skip,
      limit
    });
  }

  @patch('/usuario-clientes')
  @response(200, {
    description: 'UsuarioCliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {partial: true}),
        },
      },
    })
    usuarioCliente: UsuarioCliente,
    @param.where(UsuarioCliente) where?: Where<UsuarioCliente>,
  ): Promise<Count> {
    return this.usuarioClienteRepository.updateAll(usuarioCliente, where);
  }

  @get('/usuario-clientes/{id}')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioCliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UsuarioCliente, {exclude: 'where'}) filter?: FilterExcludingWhere<UsuarioCliente>
  ): Promise<UsuarioCliente> {
    return this.usuarioClienteRepository.findById(id, {
      include: [
        {relation: 'Cliente'},
        {relation: 'Usuario'}
      ],
    });
  }

  @patch('/usuario-clientes/{id}')
  @response(204, {
    description: 'UsuarioCliente PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {partial: true}),
        },
      },
    })
    usuarioCliente: UsuarioCliente,
  ): Promise<void> {
    await this.usuarioClienteRepository.updateById(id, usuarioCliente);
  }

  @put('/usuario-clientes/{id}')
  @response(204, {
    description: 'UsuarioCliente PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuarioCliente: UsuarioCliente,
  ): Promise<void> {
    await this.usuarioClienteRepository.replaceById(id, usuarioCliente);
  }

  @del('/usuario-clientes/{id}')
  @response(204, {
    description: 'UsuarioCliente DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioClienteRepository.deleteById(id);
  }
}
