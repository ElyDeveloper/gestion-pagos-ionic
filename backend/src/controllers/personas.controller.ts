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
  HttpErrors,
} from '@loopback/rest';
import {Personas, Usuario, UsuarioCliente} from '../models';
import {
  PersonasRepository,
  UsuarioClienteRepository,
  UsuarioRepository,
} from '../repositories';
import {JWTService} from '../services';
import {inject, service} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class PersonasController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(UsuarioClienteRepository)
    public usuarioClienteRepository: UsuarioClienteRepository,
    @service(JWTService)
    private jwtService: JWTService,
  ) {}

  @post('/personas')
  @response(200, {
    description: 'Personas model instance',
    content: {'application/json': {schema: getModelSchemaRef(Personas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {
            title: 'NewPersonas',
            exclude: ['id'],
          }),
        },
      },
    })
    personas: Omit<Personas, 'id'>,
  ): Promise<Personas> {
    //console.log('create persona: ', personas);
    return this.personasRepository.create(personas);
  }

  @post('/personas/asesor')
  @response(200, {
    description: 'UsuarioCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(UsuarioCliente)}},
  })
  async createUsuarioCliente(
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
    //console.log('create usuario/cliente: ', usuarioCliente);
    return this.usuarioClienteRepository.create(usuarioCliente);
  }

  @get('/personas/count/{idUser}')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countPersonas(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.number('idUser') idUser: number,
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    // const userId = parseInt(currentUser[securityId], 10);

    const user = await this.usuarioRepository.findById(idUser);
    // console.log('currentUser: ', user);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }

    if (user.rolid === 3) {
      const usuariosClientes = await this.usuarioClienteRepository.find({
        where: {
          usuarioId: idUser,
        },
        include: [
          {
            relation: 'cliente',
            scope: {
              where: {
                and: [{idTipoPersona: 1}, {estado: true}],
              },
            },
          },
        ],
      });

      // Filtrar y contar solo los clientes con estado=true
      const clientesActivos = usuariosClientes.filter(
        uc => uc.cliente && uc.cliente.estado === true,
      );
      const cantidadClientesActivos = clientesActivos.length;

      // //console.log('Clientes activos: ', clientesActivos);
      //console.log('Cantidad de Clientes activos: ', cantidadClientesActivos);

      return {count: cantidadClientesActivos};
    }

    // Para otros roles, mantenemos la lógica existente
    return this.personasRepository.count({
      estado: true,
    });
  }

  @get('/personas/clientes/count/{idUser}')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countClientes(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.number('idUser') idUser: number,
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    //console.log('Usuario Logueado: ', currentUser);
    // const userId = parseInt(currentUser[securityId], 10);
    //console.log('Id de Usuario Logueado en Clientes: ', userId);

    const user = await this.usuarioRepository.findById(idUser);
    console.log('currentUser: ', user);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    //console.log('Usuario encontrado: ', user);

    if (user.rolid === 3) {
      const usuariosClientes = await this.usuarioClienteRepository.find({
        where: {
          usuarioId: idUser,
        },
        include: [
          {
            relation: 'cliente',
            scope: {
              where: {
                and: [{idTipoPersona: 1}, {estado: true}],
              },
            },
          },
        ],
      });

      // Filtrar y contar solo los clientes con estado=true
      const clientesActivos = usuariosClientes.filter(
        uc => uc.cliente && uc.cliente.estado === true,
      );
      const cantidadClientesActivos = clientesActivos.length;

      //console.log('Clientes activos: ', clientesActivos);
      //console.log('Cantidad de Clientes activos: ', cantidadClientesActivos);

      return {count: cantidadClientesActivos};
    }
    return this.personasRepository.count({
      idTipoPersona: 1,
      estado: true,
    });
  }

  @get('/personas/avales/count')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countAvales(
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    return this.personasRepository.count({
      idTipoPersona: 2,
      estado: true,
    });
  }

  @get('/personas')
  @response(200, {
    description: 'Array of Personas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Personas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Personas) filter?: Filter<Personas>,
  ): Promise<Personas[]> {
    return this.personasRepository.find();
  }

  @get('/personas/todos/paginated/{idUser}')
  @response(200, {
    description: 'List of Personas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
      },
    },
  })
  async dataPaginate(
    // @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.number('idUser') idUser: number,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<any> {
    // const userId = parseInt(currentUser[securityId], 10);

    const user = await this.usuarioRepository.findById(idUser);
    console.log('Usuario encontrado: ', user);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }

    if (user.rolid === 3) {
      const [usuariosCliente] = await Promise.all([
        this.usuarioClienteRepository.find({
          where: {usuarioId: idUser, estado: true},
          include: [
            {
              relation: 'cliente',
              scope: {
                where: {estado: true},
                include: [
                  'nacionalidad',
                  'recordCrediticio',
                  'estadoCivil',
                  'tipoPersona',
                  'usuarioCliente'
                ],
              },
            },
          ],
          skip,
          limit,
          order: ['id DESC'],
        }),
      ]);

      const clients = usuariosCliente
        .map((uc: any) => uc?.cliente)
        .filter(
          (client): client is NonNullable<typeof client> => client != null,
        )
        .map(c => ({
          ...c,
          idEncrypted: this.jwtService.encryptId(c.id || 0),
        }));

      return clients;
    } else {
      const [personas] = await Promise.all([
        this.personasRepository.find({
          where: {estado: true},
          include: [
            'nacionalidad',
            'recordCrediticio',
            'estadoCivil',
            'tipoPersona',
            'usuarioCliente'
          ],
          skip,
          limit,
          order: ['id DESC'],
        }),
      ]);

      const personasConIdEncriptado = personas.map(persona => ({
        ...persona,
        idEncrypted: this.jwtService.encryptId(persona.id || 0),
      }));

      return personasConIdEncriptado;
    }
  }

  @get('/personas/clientes/paginated/{idUser}')
  @response(200, {
    description: 'List of Personas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
      },
    },
  })
  async dataPaginateClientes(
    // @inject(SecurityBindings.USER)
    // currentUser: UserProfile,
    @param.path.number('idUser') idUser: number,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<any[]> {
    //console.log('Usuario Logueado: ', currentUser);
    // const userId = parseInt(currentUser[securityId], 10);
    //console.log('Id de Usuario Logueado: ', userId);

    //console.log('Consulta paginada: ', skip);

    const personas = await this.personasRepository.find({
      where: {
        idTipoPersona: 1,
        estado: true,
      },
      include: [
        'nacionalidad',
        'recordCrediticio',
        'estadoCivil',
        'tipoPersona',
        'usuarioCliente'
      ],
      skip,
      limit,
      order: ['id DESC'],
    });

    let copiaSpread = personas.map(persona => ({
      ...persona,
      idEncrypted: this.jwtService.encryptId(persona.id || 0),
    }));

    //console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
  }

  @get('/personas/avales/paginated/{idUser}')
  @response(200, {
    description: 'List of Personas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {},
        },
      },
    },
  })
  async dataPaginateAvales(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<any[]> {
    const personas = await this.personasRepository.find({
      where: {
        idTipoPersona: 2,
        estado: true,
      },
      include: [
        'nacionalidad',
        'recordCrediticio',
        'estadoCivil',
        'tipoPersona',
        'usuarioCliente'
      ],
      skip,
      limit,
      order: ['id DESC'],
    });

    let copiaSpread = personas.map(persona => ({
      ...persona,
      idEncrypted: this.jwtService.encryptId(persona.id || 0),
    }));

    //console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
  }

  @patch('/personas')
  @response(200, {
    description: 'Personas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {partial: true}),
        },
      },
    })
    personas: Personas,
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    return this.personasRepository.updateAll(personas, where);
  }

  @get('/personas/{id}')
  @response(200, {
    description: 'Personas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Personas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Personas, {exclude: 'where'})
    filter?: FilterExcludingWhere<Personas>,
  ): Promise<Personas> {
    return this.personasRepository.findById(id, filter);
  }

  @get('/personas/asesor/{id}')
  @response(200, {
    description: 'Personas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Personas, {includeRelations: true}),
      },
    },
  })
  async findByIdAsesor(@param.path.number('id') id: number): Promise<any> {
    //console.log('Id de Cliente Desencriptado: ', id);
    return this.usuarioClienteRepository.findOne({
      where: {
        clienteId: id,
      },
      include: ['usuario'],
    });
  }

  @patch('/personas/{id}')
  @response(204, {
    description: 'Personas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {partial: true}),
        },
      },
    })
    personas: Personas,
  ): Promise<void> {
    await this.personasRepository.updateById(id, personas);
  }

  @put('/personas/{id}')
  @response(204, {
    description: 'Personas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() personas: any,
  ): Promise<void> {
    //console.log('personas', id, personas);

    try {
      await this.personasRepository.replaceById(id, personas);
    } catch (error) {
      console.error('Error updating persona:', error);
      throw new HttpErrors.InternalServerError('Error updating persona');
    }
  }

  @put('/personas/asesor/{id}')
  @response(204, {
    description: 'UsuarioCliente PUT success',
  })
  async replaceByIdCliente(
    @param.path.number('id') id: number,
    @requestBody() usuarioCliente: any,
  ): Promise<void> {
    //console.log('personas', id, usuarioCliente);

    const userClient = await this.usuarioClienteRepository.findOne({
      where: {
        clienteId: id,
      },
    });

    //console.log('Usuario Cliente', usuarioCliente);
    //console.log('User Client', userClient);

    try {
      if (userClient) {
        await this.usuarioClienteRepository.replaceById(
          userClient?.id,
          usuarioCliente,
        );
      } else {
        await this.usuarioClienteRepository.create({
          usuarioId: usuarioCliente.usuarioId,
          clienteId: usuarioCliente.clienteId,
        });
      }
    } catch (error) {
      console.error('Error updating persona:', error);
      throw new HttpErrors.InternalServerError('Error updating persona');
    }
  }

  @del('/personas/{id}')
  @response(204, {
    description: 'Personas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.personasRepository.updateById(id, {
      estado: false,
    });
  }

  @del('/personas/asesor/{id}')
  @response(204, {
    description: 'Personas DELETE success',
  })
  async deleteByIdCliente(@param.path.number('id') id: number): Promise<void> {
    const usuarioCliente = await this.usuarioClienteRepository.findOne({
      where: {
        clienteId: id,
      },
    });

    try {
      await this.usuarioClienteRepository.deleteById(usuarioCliente?.id);
    } catch {
      console.error('Error deleting usuarioCliente');
      throw new HttpErrors.InternalServerError('Error deleting usuarioCliente');
    }
  }

  @get('/personas/todos/search/{idUser}')
  async dataPersonasSearch(
    // @inject(SecurityBindings.USER)
    // currentUser: UserProfile,
    @param.path.number('idUser') userId: number,
    @param.query.string('query') search: string,
  ): Promise<any> {
    //console.log('search', search);

    //console.log('Usuario Logueado: ', currentUser);
    // const userId = parseInt(currentUser[securityId], 10);
    //console.log('Id de Usuario Logueado: ', userId);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    //console.log('Usuario encontrado: ', user);

    let idsClientes: number[] = [];
    if (user.rolid === 3) {
      const usuariosCliente = await this.usuarioClienteRepository.find({
        where: {usuarioId: userId, estado: true},
        include: [
          {
            relation: 'cliente',
            scope: {
              where: {estado: true},
              include: [
                'nacionalidad',
                'recordCrediticio',
                'estadoCivil',
                'tipoPersona',
                'usuarioCliente'
              ],
            },
          },
        ],
        order: ['id DESC'],
      });

      //Sacar ids de clientes
      idsClientes = usuariosCliente.map(uc => uc.clienteId);
    }

    let personas = await this.personasRepository.find({
      where: {
        and: [
          {
            or: [
              {id: {like: `%${search}%`}},
              {dni: {like: `%${search}%`}},
              {nombres: {like: `%${search}%`}},
              {apellidos: {like: `%${search}%`}},
            ],
          },
          {estado: true},
        ],
      },
      include: [
        'nacionalidad',
        'recordCrediticio',
        'estadoCivil',
        'tipoPersona',
        'usuarioCliente'
      ],
    });

    //console.log('Personas encontradas: ', personas.length);

    if (idsClientes && idsClientes.length > 0) {
      personas = personas.filter(persona =>
        idsClientes.includes(persona.id || 0),
      );
    }

    let copiaSpread = personas.map(persona => ({
      ...persona,
      idEncrypted: this.jwtService.encryptId(persona.id || 0),
    }));

    console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
  }

  @get('/personas/clientes/search/{idUser}')
  async dataClientesSearch(
    // @inject(SecurityBindings.USER)
    // currentUser: UserProfile,
    @param.path.number('idUser') userId: number,
    @param.query.string('query') search: string,
  ): Promise<any> {
    //console.log('search', search);

    //console.log('Usuario Logueado: ', currentUser);
    // const userId = parseInt(currentUser[securityId], 10);
    //console.log('Id de Usuario Logueado: ', userId);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    //console.log('Usuario encontrado: ', user);

    let idsClientes: number[] = [];
    if (user.rolid === 3) {
      const usuariosCliente = await this.usuarioClienteRepository.find({
        where: {usuarioId: userId, estado: true},
        include: [
          {
            relation: 'cliente',
            scope: {
              where: {estado: true},
              include: [
                'nacionalidad',
                'recordCrediticio',
                'estadoCivil',
                'tipoPersona',
                'usuarioCliente'
              ],
            },
          },
        ],
        order: ['id DESC'],
      });

      //Sacar ids de clientes
      idsClientes = usuariosCliente.map(uc => uc.clienteId);
    }

    let personas = await this.personasRepository.find({
      where: {
        and: [
          {
            or: [
              {id: {like: `%${search}%`}},
              {dni: {like: `%${search}%`}},
              {nombres: {like: `%${search}%`}},
              {apellidos: {like: `%${search}%`}},
            ],
          },
          {estado: true},
        ],
      },
      include: [
        'nacionalidad',
        'recordCrediticio',
        'estadoCivil',
        'tipoPersona',
        'usuarioCliente'
      ],
    });

    //console.log('Personas encontradas: ', personas.length);

    if (idsClientes && idsClientes.length > 0) {
      personas = personas.filter(persona =>
        idsClientes.includes(persona.id || 0),
      );
    }

    let copiaSpread = personas.map(persona => ({
      ...persona,
      idEncrypted: this.jwtService.encryptId(persona.id || 0),
    }));

    //console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
  }

  @get('/personas/avales/search/{idUser}')
  async dataAvalesSearch(
    @param.path.number('idUser') userId: number,
    @param.query.string('query') search: string,
  ): Promise<any> {
    // let PersonasSearch = await this.getPersonasSearch(search);
    //console.log('PersonasSearch', PersonasSearch);
    // return PersonasSearch;

    //console.log('search', search);

    const personas = await this.personasRepository.find({
      where: {
        and: [
          {idTipoPersona: 2},
          {estado: true},
          {
            or: [
              {id: {like: `%${search}%`}},
              {dni: {like: `%${search}%`}},
              {nombres: {like: `%${search}%`}},
              {apellidos: {like: `%${search}%`}},
            ],
          },
        ],
      },
      include: [
        'nacionalidad',
        'recordCrediticio',
        'estadoCivil',
        'tipoPersona',
      ],
    });
    let copiaSpread = personas.map(persona => ({
      ...persona,
      idEncrypted: this.jwtService.encryptId(persona.id || 0),
    }));

    //console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
  }
}
