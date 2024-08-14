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
import {TipoPrestamos} from '../models';
import {TipoPrestamosRepository} from '../repositories/tipo-prestamos.repository';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class TipoPrestamoController {
  constructor(
    @repository(TipoPrestamosRepository)
    public TipoPrestamoRepository: TipoPrestamosRepository,
  ) {}

  @post('/TipoPrestamos')
  @response(200, {
    description: 'TipoPrestamos model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoPrestamos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoPrestamos, {
            title: 'NewTipoPrestamo',
            exclude: ['id'],
          }),
        },
      },
    })
    TipoPrestamos: Omit<TipoPrestamos, 'id'>,
  ): Promise<TipoPrestamos> {
    return this.TipoPrestamoRepository.create(TipoPrestamos);
  }

  @get('/TipoPrestamos/count')
  @response(200, {
    description: 'TipoPrestamos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoPrestamos) where?: Where<TipoPrestamos>,
  ): Promise<Count> {
    return this.TipoPrestamoRepository.count(where);
  }

  @get('/TipoPrestamos')
  @response(200, {
    description: 'Array of TipoPrestamos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoPrestamos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoPrestamos) filter?: Filter<TipoPrestamos>,
  ): Promise<TipoPrestamos[]> {
    return this.TipoPrestamoRepository.find();
  }

  @get('/TipoPrestamos/paginated')
  @response(200, {
    description: 'List of TipoPrestamos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoPrestamos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<TipoPrestamos[]> {
    return this.TipoPrestamoRepository.find({skip, limit});
  }

  @patch('/TipoPrestamos')
  @response(200, {
    description: 'TipoPrestamos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoPrestamos, {partial: true}),
        },
      },
    })
    TipoPrestamos: TipoPrestamos,
    @param.where(TipoPrestamos) where?: Where<TipoPrestamos>,
  ): Promise<Count> {
    return this.TipoPrestamoRepository.updateAll(TipoPrestamos, where);
  }

  @get('/TipoPrestamos/{id}')
  @response(200, {
    description: 'TipoPrestamos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoPrestamos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoPrestamos, {exclude: 'where'})
    filter?: FilterExcludingWhere<TipoPrestamos>,
  ): Promise<TipoPrestamos> {
    return this.TipoPrestamoRepository.findById(id, filter);
  }

  @patch('/TipoPrestamos/{id}')
  @response(204, {
    description: 'TipoPrestamos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoPrestamos, {partial: true}),
        },
      },
    })
    TipoPrestamos: TipoPrestamos,
  ): Promise<void> {
    await this.TipoPrestamoRepository.updateById(id, TipoPrestamos);
  }

  @put('/TipoPrestamos/{id}')
  @response(204, {
    description: 'TipoPrestamos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() TipoPrestamos: TipoPrestamos,
  ): Promise<void> {
    await this.TipoPrestamoRepository.replaceById(id, TipoPrestamos);
  }

  @del('/TipoPrestamos/{id}')
  @response(204, {
    description: 'TipoPrestamos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.TipoPrestamoRepository.deleteById(id);
  }

  @get('/get-TipoPrestamos/{id}')
  async dataTipoPrestamoId(@param.path.number('id') id: number): Promise<any> {
    let datos = await this.getTipoPrestamoId(id);
    return datos;
  }
  async getTipoPrestamoId(id: number) {
    return await this.TipoPrestamoRepository.dataSource.execute(
      `${viewOf.getTipoPrestamos} Where estado = ${id}`,
    );
  }

  @get('/TipoPrestamos/search')
  async dataTipoPrestamoSearch(
    @param.query.string('search') search: string,
  ): Promise<any> {
    let TipoPrestamoSearch = await this.getTipoPrestamoSearch(search);
    return TipoPrestamoSearch;
  }

  async getTipoPrestamoSearch(search: string) {
    return await this.TipoPrestamoRepository.dataSource.execute(
      `${viewOf.getViewTipoPrestamos} Where Nombre like '%${search}%'`,
    );
  }

  @get('/get-TipoPrestamos')
  async dataTipoPrestamo(): Promise<any> {
    let datos = await this.getTipoPrestamo();
    return datos;
  }

  async getTipoPrestamo() {
    return await this.TipoPrestamoRepository.dataSource.execute(
      `${viewOf.getTipoPrestamos}`,
    );
  }
}
