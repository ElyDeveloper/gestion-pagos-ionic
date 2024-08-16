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
import {Productos} from '../models';
import {ProductosRepository} from '../repositories/productos.repository';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class ProductosController {
  constructor(
    @repository(ProductosRepository)
    public TipoPrestamoRepository: ProductosRepository,
  ) {}

  @post('/productos')
  @response(200, {
    description: 'Productos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Productos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Productos, {
            title: 'NewTipoPrestamo',
            exclude: ['id'],
          }),
        },
      },
    })
    Productos: Omit<Productos, 'id'>,
  ): Promise<Productos> {
    return this.TipoPrestamoRepository.create(Productos);
  }

  @get('/productos/count')
  @response(200, {
    description: 'Productos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Productos) where?: Where<Productos>,
  ): Promise<Count> {
    return this.TipoPrestamoRepository.count(where);
  }

  @get('/productos')
  @response(200, {
    description: 'Array of Productos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Productos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Productos) filter?: Filter<Productos>,
  ): Promise<Productos[]> {
    return this.TipoPrestamoRepository.find();
  }

  @get('/productos/paginated')
  @response(200, {
    description: 'List of Productos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Productos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Productos[]> {
    return this.TipoPrestamoRepository.find({skip, limit});
  }

  @patch('/productos')
  @response(200, {
    description: 'Productos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Productos, {partial: true}),
        },
      },
    })
    Productos: Productos,
    @param.where(Productos) where?: Where<Productos>,
  ): Promise<Count> {
    return this.TipoPrestamoRepository.updateAll(Productos, where);
  }

  @get('/productos/{id}')
  @response(200, {
    description: 'Productos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Productos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Productos, {exclude: 'where'})
    filter?: FilterExcludingWhere<Productos>,
  ): Promise<Productos> {
    return this.TipoPrestamoRepository.findById(id, filter);
  }

  @patch('/productos/{id}')
  @response(204, {
    description: 'Productos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Productos, {partial: true}),
        },
      },
    })
    Productos: Productos,
  ): Promise<void> {
    await this.TipoPrestamoRepository.updateById(id, Productos);
  }

  @put('/productos/{id}')
  @response(204, {
    description: 'Productos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Productos: Productos,
  ): Promise<void> {
    await this.TipoPrestamoRepository.replaceById(id, Productos);
  }

  @del('/productos/{id}')
  @response(204, {
    description: 'Productos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.TipoPrestamoRepository.deleteById(id);
  }

  @get('/get-productos/{id}')
  async dataTipoPrestamoId(@param.path.number('id') id: number): Promise<any> {
    let datos = await this.getTipoPrestamoId(id);
    return datos;
  }
  async getTipoPrestamoId(id: number) {
    return await this.TipoPrestamoRepository.dataSource.execute(
      `${viewOf.getTipoPrestamos} Where estado = ${id}`,
    );
  }

  @get('/productos/search')
  async dataProductosearch(
    @param.query.string('search') search: string,
  ): Promise<any> {
    let Productosearch = await this.getProductoSearch(search);
    return Productosearch;
  }

  async getProductoSearch(search: string) {
    return await this.TipoPrestamoRepository.dataSource.execute(
      `${viewOf.getViewTipoPrestamos} Where Nombre like '%${search}%'`,
    );
  }

  @get('/get-productos')
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
