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
import {FechasPagos} from '../models';
import {FechasPagosRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class FechasPagosController {
  constructor(
    @repository(FechasPagosRepository)
    public FechasPagosRepository : FechasPagosRepository,
  ) {}

  @post('/fechas-pagos')
  @response(200, {
    description: 'FechasPagos model instance',
    content: {'application/json': {schema: getModelSchemaRef(FechasPagos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FechasPagos, {
            title: 'NewHistorialPagos',
            
          }),
        },
      },
    })
    fechasPagos: FechasPagos,
  ): Promise<FechasPagos> {
    return this.FechasPagosRepository.create(fechasPagos);
  }

  @get('/fechas-pagos/count')
  @response(200, {
    description: 'FechasPagos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FechasPagos) where?: Where<FechasPagos>,
  ): Promise<Count> {
    return this.FechasPagosRepository.count(where);
  }

  @get('/fechas-pagos')
  @response(200, {
    description: 'Array of FechasPagos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FechasPagos, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<FechasPagos[]> {
    return this.FechasPagosRepository.find({
      include: [
        {relation: 'planPago'}
      ]
    });
  }

  @patch('/fechas-pagos')
  @response(200, {
    description: 'HistorialPagos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FechasPagos, {partial: true}),
        },
      },
    })
    fechasPagos: FechasPagos,
    @param.where(FechasPagos) where?: Where<FechasPagos>,
  ): Promise<Count> {
    return this.FechasPagosRepository.updateAll(fechasPagos, where);
  }

  @get('/fechas-pagos/paginated')
  @response(200, {
    description: 'List of FechasPagos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FechasPagos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<FechasPagos[]> {
    return this.FechasPagosRepository.find({
      include: [
        {relation: 'planPago'}
      ],
      skip,
      limit,
    });
  }

  @get('/fechas-pagos/{id}')
  @response(200, {
    description: 'FechasPagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FechasPagos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<FechasPagos> {
    return this.FechasPagosRepository.findById(id, 
      {
        include: [
          {relation: 'planPago'}
        ]
      }
    );
  }

  @patch('/fechas-pagos/{id}')
  @response(204, {
    description: 'FechasPagos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FechasPagos, {partial: true}),
        },
      },
    })
    fechasPagos: FechasPagos,
  ): Promise<void> {
    await this.FechasPagosRepository.updateById(id, fechasPagos);
  }

  @put('/fechas-pagos/{id}')
  @response(204, {
    description: 'FechasPagos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() fechasPagos: FechasPagos,
  ): Promise<void> {
    await this.FechasPagosRepository.replaceById(id, fechasPagos);
  }

  @del('/fechas-pagos/{id}')
  @response(204, {
    description: 'FechasPagos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.FechasPagosRepository.deleteById(id);
  }

  @post('/fechas-pagos/crear-fechas-pagos')
  async createFechasPagos(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              planId: {type: 'number'},
              estado: {type: 'boolean'},
              cuota: {type: 'number'},
              fechaInicio: {type: 'string', format: 'date'},
              frecuencia: {type: 'string', enum: ['semanal', 'quincenal', 'mensual']},
              numeroCuotas: {type: 'number'},
            },
          },
        },
      },
    })
    datos: {
      planId: number,
      estado: boolean,
      cuota: number,
      fechaInicio: string,
      frecuencia: string,
      numeroCuotas: number,
    },
  ): Promise<void> {
    const {planId, estado, cuota, fechaInicio, frecuencia, numeroCuotas} = datos;

    let fechaActual = new Date(fechaInicio);
    const fechasPagos = [];

    for (let i = 0; i < numeroCuotas; i++) {
      fechasPagos.push({
        planId: planId,
        estado: estado,
        cuota: cuota,
        FechaPago: fechaActual,
      });

      // Incrementar la fecha según la frecuencia
      switch (frecuencia) {
        case 'semanal':
          fechaActual.setDate(fechaActual.getDate() + 7);
          break;
        case 'quincenal':
          fechaActual.setDate(fechaActual.getDate() + 15);
          break;
        case 'mensual':
          fechaActual.setMonth(fechaActual.getMonth() + 1);
          break;
        default:
          throw new Error('Frecuencia no válida');
      }
    }

    console.log('fechas pagos: ', fechasPagos)
    await this.FechasPagosRepository.createAll(fechasPagos);
  }
}
