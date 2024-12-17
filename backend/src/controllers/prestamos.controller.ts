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
  FechasPagosRepository,
  PersonasRepository,
  PlanesPagoRepository,
  UsuarioClienteRepository,
  UsuarioRepository,
} from '../repositories';

// @authenticate('jwt')
export class PrestamosController {
  constructor(
    @repository(UsuarioClienteRepository)
    public usuarioClienteRepository: UsuarioClienteRepository,
    @repository(FechasPagosRepository)
    public fechasPagosRepository: FechasPagosRepository,
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

  @get('/prestamos/count/{idUser}')
  @response(200, {
    description: 'Prestamos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    // @inject(SecurityBindings.USER)
    // currentUser: UserProfile,
    @param.query.boolean('state') state: boolean,
    @param.path.number('idUser') userId: number,
  ): Promise<Count> {
    let condition: any = {
      or: [{idEstadoInterno: 1}, {idEstadoInterno: 2}],
    };

    if (!state) {
      condition = {};
    }
    //console.log('Consultando prestamos del Usuario Logueado, Estado: ', state);
    // const userId = parseInt(currentUser[securityId], 10);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }

    // //console.log('Usuario Logueado en prestamos: ', user);

    if (user.rolid === 3) {
      // //console.log('Consultando prestamos de todos los clientes');
      const usuariosClientes = await this.usuarioClienteRepository.find({
        where: {
          usuarioId: userId,
        },
        include: ['cliente'],
      });

      // //console.log('Clientes del Usuario Logueado: ', usuariosClientes);
      const idsClientes = usuariosClientes.map(u => u.clienteId);
      // //console.log('Ids de Clientes del Usuario Logueado: ', idsClientes);
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

  @get('/prestamos/paginated/{idUser}')
  @response(200, {
    description: 'List of Prestamos model',
    content: {
      'application/json': {
        schema: {},
      },
    },
  })
  async dataPaginate(
    // @inject(SecurityBindings.USER)
    // currentUser: UserProfile,
    @param.path.number('idUser') userId: number,

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
    //console.log('Usuario Logueado: ', currentUser);
    // const userId = parseInt(currentUser[securityId], 10);
    //console.log('Id de Usuario Logueado: ', userId);
    //console.log('Llamada de paginacion');

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    //console.log('Usuario encontrado: ', user);

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
                'usuarioCliente',
              ],
            },
          },
        ],
        order: ['id DESC'],
      });

      // //console.log('UsuariosClientes encontrados: ', usuariosCliente);

      const clients = usuariosCliente
        .map((uc: any) => {
          const ucC = uc?.cliente;
          //console.log('Cliente encontrado: ', ucC);
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
          {relation: 'cliente', scope: {include: ['usuarioCliente']}},
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

      //console.log('Personas encontradas: ', copiaSpread);

      return copiaSpread;
    }

    const prestamos = await this.prestamosRepository.find({
      where: {
        and: [{estado: state}, condition],
      },
      include: [
        {relation: 'cliente', scope: {include: ['usuarioCliente']}},
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

    //console.log('Personas encontradas: ', copiaSpread);

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
    const currentPrestamo = await this.prestamosRepository.findById(id);
    // console.log('Current Prestamo: ', currentPrestamo);

    if (currentPrestamo) {
      delete currentPrestamo.id;
      prestamos.fechaSolicitud = new Date(prestamos.fechaSolicitud);
      prestamos.fechaAprobacion =
        prestamos.fechaAprobacion !== null
          ? new Date(prestamos.fechaAprobacion)
          : null;
      // console.log('Data Received: ', prestamos);
      if (!this.areObjectsEqual(currentPrestamo, prestamos)) {
        if (prestamos.idPlan) {
          await this.fechasPagosRepository.deleteAll({
            planId: prestamos.idPlan,
          });
        }

        prestamos.idEstadoInterno = 1;
      }
    }
    await this.prestamosRepository.replaceById(id, prestamos);
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    // Si ambos son null o undefined, son iguales
    if (obj1 === null && obj2 === null) return true;
    if (obj1 === undefined && obj2 === undefined) return true;

    // Si uno es null/undefined y el otro no, son diferentes
    if (obj1 === null || obj2 === null) return false;
    if (obj1 === undefined || obj2 === undefined) return false;

    // Si no son objetos, comparación directa
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    // Si son arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) =>
        this.areObjectsEqual(item, obj2[index]),
      );
    }

    // Si uno es array y el otro no, son diferentes
    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    // Obtener las keys de ambos objetos
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Si tienen diferente número de propiedades, son diferentes
    if (keys1.length !== keys2.length) return false;

    // Comparar cada propiedad recursivamente
    return keys1.every(key => {
      if (!obj2.hasOwnProperty(key)) return false;
      return this.areObjectsEqual(obj1[key], obj2[key]);
    });
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

  @get('/prestamos/search/{idUser}')
  async dataPrestamosSearch(
    // @inject(SecurityBindings.USER)
    // currentUser: UserProfile,
    @param.path.number('idUser') userId: number,
    @param.query.string('query') search: string,
    @param.query.boolean('state') state: string,
  ): Promise<any[]> {
    let condition: any = {
      or: [{idEstadoInterno: 1}, {idEstadoInterno: 2}],
    };

    if (!state) {
      condition = {};
    }
    // const userId = parseInt(currentUser[securityId], 10);
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

    //console.log('Clientes encontrados: ', clientes.length);

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

    //console.log('Ids de Clientes: ', idsClientes);

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
        {relation: 'cliente', scope: {include: ['usuarioCliente']}},
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

    //console.log('Personas encontradas: ', copiaSpread);

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
