import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {viewOf} from '../core/library/views.library';
import {Prestamos} from '../models';
import {PrestamosRepository} from '../repositories/prestamos.repository';
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {JWTService} from '../services';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {
  PersonasRepository,
  UsuarioClienteRepository,
  UsuarioRepository,
} from '../repositories';

// @authenticate('jwt')
export class PrestamosController {
  constructor(
    @repository(UsuarioClienteRepository)
    public usuarioClienteRepository: UsuarioClienteRepository,
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
    @service(JWTService)
    private jwtService: JWTService,
  ) {}

  @post('/prestamos')
  @response(200, {
    description: 'Prestamos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prestamos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {},
        },
      },
    })
    prestamos: any,
  ): Promise<Prestamos> {
    if (typeof prestamos.idCliente === 'string') {
      prestamos.idCliente = this.jwtService.decryptId(prestamos.idCliente);
    }
    if (typeof prestamos.idAval === 'string') {
      prestamos.idAval = this.jwtService.decryptId(prestamos.idAval);
    }
    return this.prestamosRepository.create(prestamos);
  }

  @get('/prestamos/count')
  @response(200, {
    description: 'Prestamos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.where(Prestamos) where?: Where<Prestamos>,
  ): Promise<Count> {
    console.log('Usuario Logueado: ', currentUser);
    const userId = parseInt(currentUser[securityId], 10);
    console.log('Id de Usuario Logueado: ', userId);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    console.log('Usuario encontrado: ', user);

    if (user.rolid === 3) {
      const usuariosClientes = await this.usuarioClienteRepository.find({
        where: {usuarioId: userId, estado: true},
        include: ['cliente'],
      });

      console.log('Clientes del Usuario Logueado: ', usuariosClientes);
      const idsClientes = usuariosClientes.map(u => u.clienteId);
      console.log('Ids de Clientes del Usuario Logueado: ', idsClientes);
      return this.prestamosRepository.count({
        idCliente: {inq: idsClientes},
        estado: true,
      });
    }

    return this.prestamosRepository.count({
      estado: true,
    });
  }

  @get('/prestamos')
  @response(200, {
    description: 'Array of Prestamos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prestamos, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Prestamos[]> {
    return this.prestamosRepository.find({
      where: {
        estado: true,
      },
      include: [
        'cliente',
        'producto',
        'planPago',
        'moneda',
        'periodoCobro',
        'estadoAprobacion',
        'aval',
      ],
    });
  }

  @get('/prestamos/paginated')
  @response(200, {
    description: 'List of Prestamos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Prestamos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Prestamos[]> {
    console.log('Usuario Logueado: ', currentUser);
    const userId = parseInt(currentUser[securityId], 10);
    console.log('Id de Usuario Logueado: ', userId);
    console.log('Llamada de paginacion');

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    console.log('Usuario encontrado: ', user);

    if (user.rolid === 3) {
      const usuariosCliente = await this.usuarioClienteRepository.find({
        where: {usuarioId: userId, estado: true},
        include: [
          {
            relation: 'Cliente',
            scope: {
              where: {estado: true},
              include: [
                'nacionalidad',
                'recordCrediticio',
                'estadoCivil',
                'tipoPersona',
              ],
            },
          },
        ],
        skip,
        limit,
        order: ['id DESC'],
      });

      // console.log('UsuariosClientes encontrados: ', usuariosCliente);

      const clients = usuariosCliente
        .map((uc: any) => {
          const ucC = uc?.Cliente;
          console.log('Cliente encontrado: ', ucC);
          return ucC;
        })
        .filter(
          (client): client is NonNullable<typeof client> => client != null,
        );

      //Obtener los prestamos por clientes
      const prestamos = await this.prestamosRepository.find({
        where: {
          and: [
            {idCliente: {inq: clients.map((c: any) => c.id)}},
            {estado: true},
          ],
        },
        include: [
          'cliente',
          'producto',
          'planPago',
          'moneda',
          'periodoCobro',
          'estadoAprobacion',
          'aval',
        ],
        skip,
        limit,
        order: ['id DESC'],
      });

      // clonar array
      const copia: any = Array.from(prestamos);

      //encriptar id de prestamos con jwtService
      copia.forEach((prestamo: any) => {
        prestamo.id = this.jwtService.encryptId(prestamo.id || 0);
      });

      return copia;
    }

    const prestamos = await this.prestamosRepository.find({
      where: {
        estado: true,
      },
      include: [
        'cliente',
        'producto',
        'planPago',
        'moneda',
        'periodoCobro',
        'estadoAprobacion',
        'aval',
      ],
      skip,
      limit,
      order: ['id DESC'],
    });

    // clonar array
    const copia: any = Array.from(prestamos);

    //encriptar id de prestamos con jwtService
    copia.forEach((prestamo: any) => {
      prestamo.id = this.jwtService.encryptId(prestamo.id || 0);
    });

    return copia;
  }

  @patch('/prestamos')
  @response(200, {
    description: 'Prestamos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prestamos, {partial: true}),
        },
      },
    })
    Prestamos: Prestamos,
    @param.where(Prestamos) where?: Where<Prestamos>,
  ): Promise<Count> {
    return this.prestamosRepository.updateAll(Prestamos, where);
  }

  @get('/prestamos/{id}')
  @response(200, {
    description: 'Prestamos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prestamos, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Prestamos> {
    console.log('Id Encrypted: ', id);
    const idDecrypted = this.jwtService.decryptId(id);
    console.log('Id Decrypted: ', idDecrypted);
    return this.prestamosRepository.findById(idDecrypted, {
      include: [
        {
          relation: 'cliente',
          scope: {
            include: ['estadoCivil', 'nacionalidad'],
          },
        },
        'producto',
        'planPago',
        'moneda',
        'periodoCobro',
        'estadoAprobacion',
        {
          relation: 'aval',
          scope: {
            include: ['estadoCivil', 'nacionalidad'],
          },
        },
      ],
    });
  }

  @patch('/prestamos/{id}')
  @response(204, {
    description: 'Prestamos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prestamos, {partial: true}),
        },
      },
    })
    Prestamos: Prestamos,
  ): Promise<void> {
    await this.prestamosRepository.updateById(id, Prestamos);
  }

  @put('/prestamos/{id}')
  @response(204, {
    description: 'Prestamos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() prestamos: any,
  ): Promise<void> {
    //verificar si prestamos.idCliente es numero entero
    if (typeof prestamos.idCliente === 'string') {
      prestamos.idCliente = this.jwtService.decryptId(prestamos.idCliente);
    }
    if (typeof prestamos.idAval === 'string') {
      prestamos.idAval = this.jwtService.decryptId(prestamos.idAval);
    }

    console.log('Prestamo: ', prestamos);

    await this.prestamosRepository.replaceById(id, prestamos);
  }

  @del('/prestamos/{id}')
  @response(204, {
    description: 'Prestamos DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const decryptedId = await this.jwtService.decryptId(id);
    await this.prestamosRepository.updateById(decryptedId, {
      estado: false,
    });
  }

  @get('/prestamos/search')
  async dataPrestamosSearch(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.string('query') search: string,
  ): Promise<any> {

    console.log('Query a buscar: ', search);
    console.log('Usuario Logueado: ', currentUser);
    const userId = parseInt(currentUser[securityId], 10);
    console.log('Id de Usuario Logueado: ', userId);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    console.log('Usuario encontrado: ', user);

    if (user.rolid === 3) {
      const clientes = await this.personasRepository.find({
        where: {
          or: [
            {nombres: {like: `%${search}%`}},
            {apellidos: {like: `%${search}%`}},
          ],
        },
      });

      console.log('Clientes del Usuario Logueado: ', clientes);
      const idsClientes = clientes.map(u => u.clienteId);

      const prestamos = await this.prestamosRepository.find({
        where: {
          clienteId: {
            inq: idsClientes,
          },
          estado: true,
        },
        include: [
          'cliente',
          'producto',
          'periodo',
          'estadoAprobacion',
          'planPago',
          'moneda',
          'aval',
        ],
      });
      return prestamos;
    }

    const clientes = await this.personasRepository.find({
      where: {
        or: [
          {nombres: {like: `%${search}%`}},
          {apellidos: {like: `%${search}%`}},
        ],
      },
    });

    console.log('Clientes del Usuario Logueado: ', clientes);
    const idsClientes = clientes.map(u => u.id);

    const prestamos = await this.prestamosRepository.find({
      where: {
        clienteId: {
          inq: idsClientes,
        },
        estado: true,
      },
      include: [
        'cliente',
        'producto',
        'periodo',
        'estadoAprobacion',
        'planPago',
        'moneda',
        'aval',
      ],
    });
    return prestamos;
  }
}
