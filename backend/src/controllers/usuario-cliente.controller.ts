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
            required: ['usuarioId', 'clientsIds'],
          },
        },
      },
    })
    usuarioCliente: {
      usuarioId: number;
      clientsIds: string[];
    },
  ): Promise<{message: string; changes: {added: number; removed: number}}> {
    //console.log('Creando usuario-cliente...', usuarioCliente);
    try {
      if (!Array.isArray(usuarioCliente.clientsIds)) {
        throw new Error('clientsIds debe ser un array');
      }

      const userClients = await this.usuarioClienteRepository.find({
        where: {usuarioId: usuarioCliente.usuarioId},
      });

      const existingClientIds = userClients.map(uc => uc.clienteId);
      const newClientIds = usuarioCliente.clientsIds.map(id => Number(id));

      const clientsToAdd = newClientIds.filter(
        id => !existingClientIds.includes(id),
      );
      const clientsToRemove = existingClientIds.filter(
        id => !newClientIds.includes(id),
      );

      if (clientsToAdd.length === 0 && clientsToRemove.length === 0) {
        return {
          message: 'No hay cambios en los clientes por usuario',
          changes: {added: 0, removed: 0},
        };
      }

      await this.usuarioClienteRepository.deleteAll({
        usuarioId: usuarioCliente.usuarioId,
        clienteId: {inq: clientsToRemove},
      });

      const newClients = clientsToAdd.map(id => ({
        usuarioId: usuarioCliente.usuarioId,
        clienteId: id,
      }));

      await this.usuarioClienteRepository.createAll(newClients);

      return {
        message: 'Clientes por usuario actualizados correctamente',
        changes: {
          added: clientsToAdd.length,
          removed: clientsToRemove.length,
        },
      };
    } catch (error) {
      console.error('Error al actualizar clientes por usuario:', error);
      throw new Error('Error al procesar la solicitud');
    }
  }

  @post('/usuario-clientes/one')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(UsuarioCliente)}},
  })
  async createOne(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {
            title: 'NewUsuarioCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    usuarioCliente: Omit<UsuarioCliente, 'id'>,
  ): Promise<UsuarioCliente> {
    //console.log('Creando usuario-cliente...', usuarioCliente);
    return this.usuarioClienteRepository.create(usuarioCliente);
  }

  @post('/usuario-clientes/transfer')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(UsuarioCliente)}},
  })
  async transfer(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCliente, {
            title: 'NewUsuarioCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    data: any,
  ): Promise<void> {
    //console.log('Creando usuario-cliente...', data);

    const { idUserOld, idUserNew } = data;

    const userClients = await this.usuarioClienteRepository.find({
      where: {usuarioId: idUserOld},
    });
    
    const newClientIds = userClients.map((element) => Number(element.clienteId));
    
    await this.usuarioClienteRepository.deleteAll({
      usuarioId: idUserOld,
      clienteId: {inq: newClientIds},
    });

    const newClients = newClientIds.map((id:number) => ({
      usuarioId: idUserNew,
      clienteId: id,
    }));

    await this.usuarioClienteRepository.createAll(newClients);
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
    //console.log('Buscando Usuario Cliente:', id);
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
    //console.log('Buscando Usuario Cliente:', id);
    const userClients = await this.usuarioClienteRepository.find({
      where: {
        usuarioId: id,
      },
      include: [{relation: 'cliente'}, {relation: 'usuario'}],
    });

    if (userClients.length > 0) {
      const clients = userClients.map(uc => uc.cliente);

      return clients;
    }

    return userClients;
  }

  @get('/usuario-clientes/by-cliente/{id}')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UsuarioCliente, {includeRelations: true}),
      },
    },
  })
  async findByClienteId(@param.path.number('id') id: number): Promise<any> {
    //console.log('Buscando Usuario Cliente:', id);
    const userClients = await this.usuarioClienteRepository.find({
      where: {
        clienteId: id,
      },
      include: [{relation: 'usuario'}],
    });

    if (userClients.length > 0) {
      return userClients[0];
    }

    return [];
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

  @del('/usuario-clientes/by-cliente/{id}')
  @response(204, {
    description: 'UsuarioCliente DELETE success',
  })
  async deleteByIdCliente(@param.path.number('id') id: number): Promise<void> {
    const usuarioCliente = await this.usuarioClienteRepository.findOne({
      where: {
        clienteId: id,
      },
    });
    await this.usuarioClienteRepository.deleteById(usuarioCliente?.id);
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
