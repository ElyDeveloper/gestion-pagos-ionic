import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Personas,
  UsuarioCliente,
  UsuarioCliente,
} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasUsuarioClienteController {
  constructor(
    @repository(PersonasRepository) protected personasRepository: PersonasRepository,
  ) { }

  @get('/personas/{id}/usuario-cliente', {
    responses: {
      '200': {
        description: 'Personas has one UsuarioCliente',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UsuarioCliente),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UsuarioCliente>,
  ): Promise<UsuarioCliente> {
    return this.personasRepository.usuarioCliente(id).get(filter);
  }

  @post('/personas/{id}/usuario-cliente', {
    responses: {
      '200': {
        description: 'Personas model instance',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioCliente)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Personas.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {
            title: 'NewUsuarioClienteInPersonas',
            exclude: ['id'],
            optional: ['clienteId']
          }),
        },
      },
    }) usuarioCliente: Omit<UsuarioCliente, 'id'>,
  ): Promise<UsuarioCliente> {
    return this.personasRepository.usuarioCliente(id).create(usuarioCliente);
  }

  @patch('/personas/{id}/usuario-cliente', {
    responses: {
      '200': {
        description: 'Personas.UsuarioCliente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {partial: true}),
        },
      },
    })
    usuarioCliente: Partial<UsuarioCliente>,
    @param.query.object('where', getWhereSchemaFor(UsuarioCliente)) where?: Where<UsuarioCliente>,
  ): Promise<Count> {
    return this.personasRepository.usuarioCliente(id).patch(usuarioCliente, where);
  }

  @del('/personas/{id}/usuario-cliente', {
    responses: {
      '200': {
        description: 'Personas.UsuarioCliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UsuarioCliente)) where?: Where<UsuarioCliente>,
  ): Promise<Count> {
    return this.personasRepository.usuarioCliente(id).delete(where);
  }
}
