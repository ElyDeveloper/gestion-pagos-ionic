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
import {authenticate} from '@loopback/authentication';
import {JWTService} from '../services';
import {service} from '@loopback/core';

@authenticate('jwt')
export class UsuarioClienteController {
  constructor(
    @repository(UsuarioClienteRepository)
    public usuarioClienteRepository: UsuarioClienteRepository,
    @service(JWTService)
    private jwtService: JWTService,
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
          schema: {
            type: 'object',
            properties: {
              usuarioId: {type: 'number'},
              clientsIds: {type: 'array', items: {type: 'string'}},
            },
            required: ['usuarioId'],
          },
        },
      },
    })
    usuarioCliente: any,
  ): Promise<any> {
    console.log('Usuario Cliente:', usuarioCliente);

    //Obtener los clientes por usuario
    const userClients = await this.usuarioClienteRepository.find({
      where: {
        usuarioId: usuarioCliente.usuarioId,
      },
    });

    if (userClients.length > 0) {
      //Comparar si el array de ids coincide con los que ya existen en la base de datos
      const clientsIds = userClients.map(uc => uc.clientsIds);
      const newClientsIds = usuarioCliente.clientsIds;

      const decryptedNewClientsIds = newClientsIds.map((id: string) =>
        this.jwtService.decryptId(id),
      );

      const intersection = clientsIds.filter(id =>
        decryptedNewClientsIds.includes(id),
      );

      if (intersection.length === decryptedNewClientsIds.length) {
        //Si coinciden, no hay cambios
        return {message: 'No hay cambios en los clientes por usuario'};
      }

      //Si no coinciden, eliminar los clientes que no existen en el nuevo array
      const clientsToDelete = clientsIds.filter(
        id => !decryptedNewClientsIds.includes(id),
      );
      await this.usuarioClienteRepository.deleteAll({
        usuarioId: usuarioCliente.usuarioId,
        clienteId: clientsToDelete,
      });

      //Agregar los nuevos clientes
      const newClients = decryptedNewClientsIds.map((id: number) => ({
        usuarioId: usuarioCliente.usuarioId,
        clienteId: id,
      }));

      await this.usuarioClienteRepository.createAll(newClients);
    } else {
      //Si no hay clientes por usuario, crearlos
      await this.usuarioClienteRepository.createAll(
        usuarioCliente.clientsIds.map((id: string) => ({
          usuarioId: usuarioCliente.usuarioId,
          clienteId: this.jwtService.decryptId(id),
        })),
      );
    }

    console.log('Clientes por usuario:', userClients);

    return {message: 'Usuario Cliente creado correctamente'};
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
      include: [{relation: 'Cliente'}, {relation: 'Usuario'}],
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
  ): Promise<UsuarioCliente[]> {
    return this.usuarioClienteRepository.find({
      include: [{relation: 'Cliente'}, {relation: 'Usuario'}],
      skip,
      limit,
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
    @param.filter(UsuarioCliente, {exclude: 'where'})
    filter?: FilterExcludingWhere<UsuarioCliente>,
  ): Promise<UsuarioCliente> {
    console.log('Buscando Usuario Cliente:', id);
    return this.usuarioClienteRepository.findById(id, {
      include: [{relation: 'Cliente'}, {relation: 'Usuario'}],
    });
  }

  @get('/usuario-clientes/by-usuario/{id}')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioCliente, {includeRelations: true}),
      },
    },
  })
  async findByUserId(
    @param.path.number('id') id: number,
    @param.filter(UsuarioCliente, {exclude: 'where'})
    filter?: FilterExcludingWhere<UsuarioCliente>,
  ): Promise<UsuarioCliente[]> {
    console.log('Buscando Usuario Cliente:', id);
    return this.usuarioClienteRepository.find({
      where: {
        usuarioId: id,
      },
      include: [{relation: 'Cliente'}, {relation: 'Usuario'}],
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

  @put('/usuario-clientes/transferir-cartera/{id}&{id2}')
  @response(204, {
    description: 'UsuarioCliente PUT success',
  })
  async transferirCartera(
    @param.path.number('id') id: number,
    @param.path.number('id2') id2: number,
  ): Promise<void> {
    await this.usuarioClienteRepository.transferirCartera(id, id2);
  }
}
