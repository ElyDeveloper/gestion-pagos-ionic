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
  Prestamos,
  Pagos,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosPagosController {
  constructor(
    @repository(PrestamosRepository) protected prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/pagos', {
    responses: {
      '200': {
        description: 'Array of Prestamos has many Pagos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Pagos)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Pagos>,
  ): Promise<Pagos[]> {
    return this.prestamosRepository.pagos(id).find(filter);
  }

  @post('/prestamos/{id}/pagos', {
    responses: {
      '200': {
        description: 'Prestamos model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pagos)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {
            title: 'NewPagosInPrestamos',
            exclude: ['id'],
            optional: ['idPrestamo']
          }),
        },
      },
    }) pagos: Omit<Pagos, 'id'>,
  ): Promise<Pagos> {
    return this.prestamosRepository.pagos(id).create(pagos);
  }

  @patch('/prestamos/{id}/pagos', {
    responses: {
      '200': {
        description: 'Prestamos.Pagos PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {partial: true}),
        },
      },
    })
    pagos: Partial<Pagos>,
    @param.query.object('where', getWhereSchemaFor(Pagos)) where?: Where<Pagos>,
  ): Promise<Count> {
    return this.prestamosRepository.pagos(id).patch(pagos, where);
  }

  @del('/prestamos/{id}/pagos', {
    responses: {
      '200': {
        description: 'Prestamos.Pagos DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Pagos)) where?: Where<Pagos>,
  ): Promise<Count> {
    return this.prestamosRepository.pagos(id).delete(where);
  }
}
