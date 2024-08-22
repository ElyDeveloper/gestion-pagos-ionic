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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {viewOf} from '../core/library/views.library';
import {Pagos} from '../models/pagos.model';
import {PagosRepository} from '../repositories/pagos.repository';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class PagosController {
  constructor(
    @repository(PagosRepository)
    public PagosRepository: PagosRepository,
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
    return this.PagosRepository.create(Pagos);
  }

  @get('/pagos/count')
  @response(200, {
    description: 'Pagos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Pagos) where?: Where<Pagos>): Promise<Count> {
    return this.PagosRepository.count(where);
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
    return this.PagosRepository.find(
      {
        include:[
          {relation: 'prestamos'},
        ],
      }
    );
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
    return this.PagosRepository.find({
      include:[
        {relation: 'prestamos'},
      ],
      skip,
      limit
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
    return this.PagosRepository.updateAll(Pagos, where);
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
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Pagos> {
    return this.PagosRepository.findById(id);
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
    await this.PagosRepository.updateById(id, Pagos);
  }

  @put('/pagos/{id}')
  @response(204, {
    description: 'Pagos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Pagos: Pagos,
  ): Promise<void> {
    await this.PagosRepository.replaceById(id, Pagos);
  }

  @del('/pagos/{id}')
  @response(204, {
    description: 'Pagos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.PagosRepository.deleteById(id);
  }

  @get('/pagos/search')
  async dataPagosSearch(
    @param.query.string('search') search: string,
  ): Promise<any> {
    let PagosSearch = await this.getPagosSearch(search);
    return PagosSearch;
  }

  async getPagosSearch(search: string) {
    return await this.PagosRepository.dataSource.execute(
      `${viewOf.getViewPagos} Where ClienteNombre like '%${search}%' or ClienteApellidos like '%${search}%' or TipoPrestamoNombre like '%${search}%'  or Monto like '%${search}%'  or FechaPago like '%${search}%' or FechaInicial like '%${search}%' or FechaFinal like '%${search}%'`,
    );
  }

  
}
