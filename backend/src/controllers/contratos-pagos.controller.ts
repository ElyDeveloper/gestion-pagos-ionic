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
import {ContratosPago} from '../models';
import {ContratosPagoRepository} from '../repositories';
import {service} from '@loopback/core';
import {AuthService, GlobalService, JWTService} from '../services';

export class ContratosPagosController {
  constructor(
    @repository(ContratosPagoRepository)
    public contratosPagoRepository: ContratosPagoRepository,
    @service(GlobalService)
    private globalService: GlobalService,
    @service(JWTService)
    private jwtService: JWTService,
  ) {}

  @post('/contratos-pagos')
  @response(200, {
    description: 'ContratosPago model instance',
    content: {'application/json': {schema: getModelSchemaRef(ContratosPago)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosPago, {
            title: 'NewContratosPago',
            exclude: ['id'],
          }),
        },
      },
    })
    contratosPago: Omit<ContratosPago, 'id'>,
  ): Promise<any> {
    const content = JSON.parse(contratosPago.contenido);
    const xml = this.globalService.jsonToXml(content);

    //console.log('ContratosPago XML: ', xml);

    contratosPago.contenido = xml;

    // return {xml: xml};
    return this.contratosPagoRepository.create(contratosPago);
  }

  @get('/contratos-pagos/count')
  @response(200, {
    description: 'ContratosPago model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ContratosPago) where?: Where<ContratosPago>,
  ): Promise<Count> {
    return this.contratosPagoRepository.count(where);
  }

  @get('/contratos-pagos/correlativo')
  @response(200, {
    description: 'ContratosPago model count',
    content: {
      'application/json': {
        schema: {
          correlativo: {type: 'string'},
        },
      },
    },
  })
  async getCorrelativo(): Promise<any> {
    //obtener el ultimo elemento registrado
    const lastContrato = await this.contratosPagoRepository.find({
      order: ['id DESC'],
      limit: 1,
    });

    //console.log(lastContrato);

    if (lastContrato.length === 0) {
      return {correlativo: 'CON-1'};
    }

    return {
      correlativo: `CON-${parseInt(lastContrato[0].correlativo.split('-')[1]) + 1}`,
    };
  }

  @get('/contratos-pagos/paginated')
  @response(200, {
    description: 'List of Contratos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ContratosPago, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<any[]> {
    //console.log('Llamada de paginacion');
    const contratos = await this.contratosPagoRepository.find({
      include: [
        {relation: 'prestamo', scope: {include: [{relation: 'cliente'}]}},
      ],
      skip,
      limit,
    });

    let copiaSpread = contratos.map(contrato => ({
      ...contrato,
      idPrestamoEncrypted: this.jwtService.encryptId(contrato.idPrestamo|| 0),
    }));

    //console.log('Contratos encontrados: ', copiaSpread);

    return copiaSpread;
  }

  @get('/contratos-pagos/verify/{id}')
  @response(200, {
    description: 'ContratosPago model count',
    content: {
      'application/json': {
        schema: {
          exist: {type: 'boolean'},
        },
      },
    },
  })
  async verify(@param.path.number('id') id: number): Promise<any> {
    const contrato = await this.contratosPagoRepository.findOne({
      where: {idPrestamo: id},
    });

    if (!contrato) {
      return {exist: false, content: 'Contrato no encontrado'};
    }

    const content = contrato.contenido;
    const objeto = await this.globalService.xmlToJson(content);

    //console.log('ContratosPago JSON: ', objeto);
    return {exist: true, content: objeto, correlativo: contrato.correlativo};
  }

  @get('/contratos-pagos')
  @response(200, {
    description: 'Array of ContratosPago model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ContratosPago, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<ContratosPago[]> {
    const contratos = await this.contratosPagoRepository.find({
      include: [{relation: 'prestamo'}],
    });

    contratos.map(async contrato => {
      const json = await this.globalService.xmlToJson(contrato.contenido);
      //console.log('ContratosPago JSON: ', json);
      return contrato;
    });

    return contratos;
  }

  @patch('/contratos-pagos')
  @response(200, {
    description: 'ContratosPago PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosPago, {partial: true}),
        },
      },
    })
    contratosPago: ContratosPago,
    @param.where(ContratosPago) where?: Where<ContratosPago>,
  ): Promise<Count> {
    return this.contratosPagoRepository.updateAll(contratosPago, where);
  }

  @get('/contratos-pagos/{id}')
  @response(200, {
    description: 'ContratosPago model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ContratosPago, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ContratosPago, {exclude: 'where'})
    filter?: FilterExcludingWhere<ContratosPago>,
  ): Promise<ContratosPago> {
    return this.contratosPagoRepository.findById(id, filter);
  }

  @patch('/contratos-pagos/{id}')
  @response(204, {
    description: 'ContratosPago PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContratosPago, {partial: true}),
        },
      },
    })
    contratosPago: ContratosPago,
  ): Promise<void> {
    await this.contratosPagoRepository.updateById(id, contratosPago);
  }

  @put('/contratos-pagos/{id}')
  @response(204, {
    description: 'ContratosPago PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() contratosPago: ContratosPago,
  ): Promise<void> {
    await this.contratosPagoRepository.replaceById(id, contratosPago);
  }

  @del('/contratos-pagos/{id}')
  @response(204, {
    description: 'ContratosPago DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.contratosPagoRepository.deleteById(id);
  }

  @get('/contratos-pagos/search')
  async dataSearch(@param.query.string('query') search: string): Promise<any> {
    let contratos = await this.contratosPagoRepository.find({
      include: [
        {relation: 'prestamo', scope: {include: [{relation: 'cliente'}]}},
      ],
      where: {
        or: [
          {correlativo: {like: `%${search}%`}},
        ],
      },
    });

    let copiaSpread = contratos.map(contrato => ({
      ...contrato,
      idPrestamoEncrypted: this.jwtService.encryptId(contrato.idPrestamo|| 0),
    }));

    return copiaSpread;
  }
}
