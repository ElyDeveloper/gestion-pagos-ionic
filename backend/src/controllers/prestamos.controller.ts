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
    @param.query.boolean('state') state: boolean,
  ): Promise<Count> {
    let condition: any = {
      or: [{idEstadoInterno: 1}, {idEstadoInterno: 2}],
    };

    if (!state) {
      condition = {};
    }
    console.log('Consultando prestamos del Usuario Logueado, Estado: ', state);
    const userId = parseInt(currentUser[securityId], 10);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }

    // console.log('Usuario Logueado en prestamos: ', user);

    if (user.rolid === 3) {
      // console.log('Consultando prestamos de todos los clientes');
      const usuariosClientes = await this.usuarioClienteRepository.find({
        where: {
          usuarioId: userId,
        },
        include: ['cliente'],
      });

      // console.log('Clientes del Usuario Logueado: ', usuariosClientes);
      const idsClientes = usuariosClientes.map(u => u.clienteId);
      // console.log('Ids de Clientes del Usuario Logueado: ', idsClientes);
      return this.prestamosRepository.count({
        and: [{idCliente: {inq: idsClientes}}, {estado: state}, condition],
      });
    }

    return this.prestamosRepository.count({
      and: [{estado: state}, condition],
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
        'estadoInterno',
        'aval',
      ],
    });
  }

  @get('/prestamos/paginated')
  @response(200, {
    description: 'List of Prestamos model',
    content: {
      'application/json': {
        schema: {},
      },
    },
  })
  async dataPaginate(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
    @param.query.boolean('state') state: boolean,
  ): Promise<any[]> {
    let condition: any = {
      or: [{idEstadoInterno: 1}, {idEstadoInterno: 2}],
    };

    if (!state) {
      condition = {};
    }
    // console.log('Usuario Logueado: ', currentUser);
    const userId = parseInt(currentUser[securityId], 10);
    // console.log('Id de Usuario Logueado: ', userId);
    // console.log('Llamada de paginacion');

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    // console.log('Usuario encontrado: ', user);

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
              ],
            },
          },
        ],
        order: ['id DESC'],
      });

      // console.log('UsuariosClientes encontrados: ', usuariosCliente);

      const clients = usuariosCliente
        .map((uc: any) => {
          const ucC = uc?.cliente;
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
            {estado: state},
            condition,
          ],
        },
        include: [
          'cliente',
          'producto',
          'planPago',
          'moneda',
          'periodoCobro',
          'estadoInterno',
          'aval',
        ],
        skip,
        limit,
        order: ['id DESC'],
      });

      let copiaSpread = prestamos.map(prestamo => ({
        ...prestamo,
        idEncrypted: this.jwtService.encryptId(prestamo.id || 0),
      }));

      // console.log('Personas encontradas: ', copiaSpread);

      return copiaSpread;
    }

    const prestamos = await this.prestamosRepository.find({
      where: {
        and: [{estado: state}, condition],
      },
      include: [
        'cliente',
        'producto',
        'planPago',
        'moneda',
        'periodoCobro',
        'estadoInterno',
        'aval',
      ],
      skip,
      limit,
      order: ['id DESC'],
    });

    let copiaSpread = prestamos.map(prestamo => ({
      ...prestamo,
      idEncrypted: this.jwtService.encryptId(prestamo.id || 0),
    }));

    // console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
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
  async findById(@param.path.number('id') id: number): Promise<Prestamos> {
    return this.prestamosRepository.findById(id, {
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
        'estadoInterno',
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
    await this.prestamosRepository.replaceById(id, prestamos);
  }

  @del('/prestamos/{id}')
  @response(204, {
    description: 'Prestamos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.prestamosRepository.updateById(id, {
      estado: false,
    });
  }

  @get('/prestamos/search')
  async dataPrestamosSearch(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.string('query') search: string,
    @param.query.boolean('state') state: string,
  ): Promise<any[]> {
    let condition: any = {
      or: [{idEstadoInterno: 1}, {idEstadoInterno: 2}],
    };

    if (!state) {
      condition = {};
    }
    const userId = parseInt(currentUser[securityId], 10);
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }

    let idsClientes: number[] = [];
    const clientes = await this.personasRepository.find({
      where: {
        and: [
          {idTipoPersona: 1},
          {
            or: [
              {nombres: {like: `%${search}%`}},
              {apellidos: {like: `%${search}%`}},
              {dni: {like: `%${search}%`}},
            ],
          },
        ],
      },
    });

    console.log('Clientes encontrados: ', clientes.length);

    if (user.rolid === 3) {
      const usuariosCliente = await this.usuarioClienteRepository.find({
        where: {
          and: [
            {usuarioId: userId},
            {estado: true},
            {clienteId: {inq: clientes.map(c => c.id)}},
          ],
        },
      });

      idsClientes = usuariosCliente.map(uc => uc.clienteId);
    } else {
      idsClientes = clientes.map(c => c.id || 0);
    }

    console.log('Ids de Clientes: ', idsClientes);

    const prestamos = await this.prestamosRepository.find({
      where: {
        or: [
          {id: {like: `%${search}%`}},
          {
            and: [
              {
                idCliente: {
                  inq: idsClientes,
                },
              },
              {estado: state},
              condition,
            ],
          },
        ],
      },
      include: [
        'cliente',
        'producto',
        'periodoCobro',
        'estadoInterno',
        'planPago',
        'moneda',
        'aval',
      ],
    });

    let copiaSpread = prestamos.map(prestamo => ({
      ...prestamo,
      idEncrypted: this.jwtService.encryptId(prestamo.id || 0),
    }));

    // console.log('Personas encontradas: ', copiaSpread);

    return copiaSpread;
  }

  //endpoint para ejecutar el procedimiento almacenado de reporte de mora
  @get('/prestamos/reporte-mora')
  async reporteMora(
    @param.query.number('idUsuario') idUsuario: number,
  ): Promise<any> {
    return this.prestamosRepository.dataSource.execute(
      `SP_ReporteMora ${idUsuario}`,
      [],
    );
  }

  //endpoint para ejecutar el procedimiento almacenado de reporte de prestamos
  @get('/prestamos/reporte-recordCrediticio')
  async reportePrestamos(
    @param.query.number('idCliente') idCliente: number,
  ): Promise<any> {
    const encabezados = await this.prestamosRepository.dataSource.execute(
      `SP_encabezadosRecordCrediticio ${idCliente}`,
      [],
    );

    const cuerpo = await this.prestamosRepository.dataSource.execute(
      `SP_cuerpoRecordCrediticio ${idCliente}`,
      [],
    );

    const activos = await this.prestamosRepository.dataSource.execute(
      `SP_pieRecordCrediticio ${idCliente}`,
    );

    const completados = await this.prestamosRepository.dataSource.execute(
      `SP_pieRecordCrediticioCompletados ${idCliente}`,
    );

    return {
      encabezados,
      cuerpo,
      pie: {
        activos,
        completados,
      },
    };
  }

  //endpoint para ejecutar el procedimiento almacenado de reporte de cartera asesor
  @get('/prestamos/reporte-cartera-asesor')
  async reporteCarteraAsesor(
    @param.query.number('idUsuario') idUsuario: number,
  ): Promise<any> {
    return this.prestamosRepository.dataSource.execute(
      `SP_ReporteCarteraAsesor ${idUsuario}`,
      [],
    );
  }

  //endpoint para ejecutar el procedimiento almacenado de reporte de informacion de saldo de cuenta
  @get('/prestamos/reporte-estado-cuenta')
  async reporteInformacionPagos(
    @param.query.number('idCliente') idCliente: number,
  ): Promise<any> {
    const encabezados = await this.prestamosRepository.dataSource.execute(
      `SP_RTextosSaldosTotales ${idCliente}`,
      [],
    );

    const saldoVigente = await this.prestamosRepository.dataSource.execute(
      `SP_RSaldosVigentes ${idCliente}`,
      [],
    );

    const pagosEfectuados = await this.prestamosRepository.dataSource.execute(
      `SP_RDetallePagosEfectuados ${idCliente}`,
      [],
    );

    const saldosPagarAtrasados =
      await this.prestamosRepository.dataSource.execute(
        `SP_RSaldos_PagarAtrasados ${idCliente}`,
        [],
      );

    return {
      encabezados,
      saldoVigente,
      saldosPagarAtrasados,
      pagosEfectuados,
    };
  }
}
