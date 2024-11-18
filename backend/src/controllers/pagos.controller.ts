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
import {Pagos} from '../models/pagos.model';
import {authenticate} from '@loopback/authentication';
import {Documentos, DocumentosTipoDoc} from '../models';
import {ContratosPagoRepository} from '../repositories/contratos-pago.repository';
import {
  DocumentosRepository,
  DocumentosTipoDocRepository,
  FechasPagosRepository,
  MorasRepository,
  PagosRepository,
  PlanesPagoRepository,
  PrestamosRepository,
} from '../repositories';

@authenticate('jwt')
export class PagosController {
  constructor(
    @repository(PagosRepository)
    public pagosRepository: PagosRepository,
    @repository(MorasRepository)
    public morasRepository: MorasRepository,
    @repository(PlanesPagoRepository)
    public planesPagoRepository: PlanesPagoRepository,
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
    @repository(FechasPagosRepository)
    public fechasPagosRepository: FechasPagosRepository,
    @repository(DocumentosRepository)
    public documentosRepository: DocumentosRepository,
    @repository(DocumentosTipoDocRepository)
    public documentosTipoDocRepository: DocumentosTipoDocRepository,
    @repository(ContratosPagoRepository)
    public contratosPagoRepository: ContratosPagoRepository,
  ) {}

  @post('/pagos')
  @response(200, {
    description: 'Pagos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Pagos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {
            title: 'NewPagos',
            exclude: ['id'],
          }),
        },
      },
    })
    Pagos: Omit<Pagos, 'id'>,
  ): Promise<Pagos> {
    return this.pagosRepository.create(Pagos);
  }

  @get('/pagos/count')
  @response(200, {
    description: 'Pagos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.pagosRepository.count();
  }

  @get('/pagos')
  @response(200, {
    description: 'Array of Pagos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pagos, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Pagos[]> {
    return this.pagosRepository.find({
      include: [{relation: 'cuota'}],
    });
  }

  @get('/pagos/paginated')
  @response(200, {
    description: 'List of Pagos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pagos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Pagos[]> {
    //console.log('skip', skip);
    //console.log('limit', limit);
    return this.pagosRepository.find({
      include: [
        {
          relation: 'cuota',
          scope: {
            include: [
              {
                relation: 'planPago',
                scope: {
                  include: [
                    {
                      relation: 'prestamo',
                      scope: {
                        include: [
                          {
                            relation: 'cliente',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'documentosTipoDoc',
          scope: {
            include: [{relation: 'documentos'}],
          },
        },
      ],
      skip,
      limit,
      order: ['id DESC'],
    });
  }

  @patch('/pagos')
  @response(200, {
    description: 'Pagos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {partial: true}),
        },
      },
    })
    Pagos: Pagos,
    @param.where(Pagos) where?: Where<Pagos>,
  ): Promise<Count> {
    return this.pagosRepository.updateAll(Pagos, where);
  }

  @get('/pagos/{id}')
  @response(200, {
    description: 'Pagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pagos, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Pagos> {
    return this.pagosRepository.findById(id);
  }

  @get('/pagos/fecha-pago/{id}')
  @response(200, {
    description: 'Pagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pagos, {includeRelations: true}),
      },
    },
  })
  async findByIdFechaPago(
    @param.path.number('id') id: number,
  ): Promise<Pagos[]> {
    //console.log('Buscando pagos por fecha de pago:', id);
    return this.pagosRepository.find({
      where: {idFechaPago: id},
    });
  }

  @patch('/pagos/{id}')
  @response(204, {
    description: 'Pagos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {partial: true}),
        },
      },
    })
    Pagos: Pagos,
  ): Promise<void> {
    await this.pagosRepository.updateById(id, Pagos);
  }

  @put('/pagos/{id}')
  @response(204, {
    description: 'Pagos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Pagos: Pagos,
  ): Promise<void> {
    await this.pagosRepository.replaceById(id, Pagos);
  }

  @del('/pagos/{id}')
  @response(204, {
    description: 'Pagos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const pago = await this.pagosRepository.findById(id);
    if (!pago) {
      throw new HttpErrors.NotFound(`No se encontró el pago con id=${id}`);
    }

    //Eliminar mora por idFechaPago
    const mora = await this.morasRepository.findOne({
      where: {
        idFechaPago: pago.idFechaPago,
      },
    });

    if (mora) {
      await this.morasRepository.deleteById(mora.id);
    }

    await this.fechasPagosRepository.updateById(pago.idFechaPago, {
      estado: false,
    });

    const documentoTipoDoc = await this.documentosTipoDocRepository.findOne({
      where: {
        idDocumento: pago.id,
      },
    });

    if (documentoTipoDoc) {
      const documento = await this.documentosRepository.findOne({
        where: {
          idDocTipDoc: documentoTipoDoc.id,
        },
      });

      if (documento) {
        await this.documentosRepository.deleteById(documento.id);
      }

      await this.documentosTipoDocRepository.deleteById(documentoTipoDoc.id);
    }

    //INFO ELIMINAR PAGO POR ID
    await this.pagosRepository.deleteById(id);

    //INFO OBTENER FECHAS PAGOS CON PAGO
    const fechaPago = await this.fechasPagosRepository.findById(
      pago.idFechaPago,
    );
    if (fechaPago) {
      //INFO CONTAR CUOTAS PAGADAS EN FECHAS PAGOS
      const countCuotasPagadas = await this.fechasPagosRepository.count({
        planId: fechaPago.planId,
        estado: true,
      });

      //console.log('Cuotas pagadas:', countCuotasPagadas.count);

      //INFO ACTUALIZAR PLAN DE PAGO
      await this.planesPagoRepository.updateById(fechaPago.planId, {
        cuotaPagadas: countCuotasPagadas.count,
      });
    }

    //INFO ACTIVAR PRESTAMO
    //Actualizar el estado del prestamo a true y el idEstadoInterno
    const prestamo = await this.prestamosRepository.findOne({
      where: {
        idPlan: fechaPago.planId,
      },
    });

    if (prestamo?.idEstadoInterno === 4) {
      // console.log('Prestamo:', prestamo);
      await this.prestamosRepository.updateById(prestamo.id, {
        idEstadoInterno: 2,
        estado: true,
      });
    }
  }

  @get('/pagos/search')
  async dataPagosSearch(
    @param.query.string('query') search: string,
  ): Promise<Pagos[]> {
    console.log('Buscando pagos por código de cuota:', search);
    const pagos = await this.pagosRepository.find({
      where: {
        idFechaPago: {like: `%${search}%`},
      },
      include: [
        {
          relation: 'cuota',
          scope: {
            include: [
              {
                relation: 'planPago',
                scope: {
                  include: [
                    {
                      relation: 'prestamo',
                      scope: {
                        include: [
                          {
                            relation: 'cliente',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'documentosTipoDoc',
          scope: {
            include: [{relation: 'documentos'}],
          },
        },
      ],
    });

    // console.log('Pagos encontrados:', JSON.stringify(pagos));

    return pagos;
  }
}
