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
import {Prestamos} from '../models';
import {PrestamosRepository} from '../repositories/Prestamos.repository';

// @authenticate('admin', 'owner')

export class PrestamosController {
  constructor(
    @repository(PrestamosRepository)
    public PrestamosRepository: PrestamosRepository
  ) {}

  @post('/Prestamos')
  @response(200, {
    description: 'Prestamos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Prestamos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Prestamos, {
            title: 'NewPrestamos',
            exclude: ['id'],
          }),
        },
      },
    })
    Prestamos: Omit<Prestamos, 'id'>,
  ): Promise<Prestamos> {
    return this.PrestamosRepository.create(Prestamos);
  }

  @get('/Prestamos/count')
  @response(200, {
    description: 'Prestamos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Prestamos) where?: Where<Prestamos>,
  ): Promise<Count> {
    return this.PrestamosRepository.count(where);
  }

  @get('/Prestamos')
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
    return this.PrestamosRepository.find({
      include: [
        {relation: 'cliente'},
        {relation: 'tipoPrestamo'},
        {relation: 'cuotas'},
      ],
    });
  }

  @get('/Prestamos/paginated')
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
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Prestamos[]> {
    return this.PrestamosRepository.find({
      include: [
        {relation: 'cliente'},
        {relation: 'tipoPrestamo'},
        {relation: 'cuotas'},
      ],
      skip,
      limit
    });
  }

  @patch('/Prestamos')
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
    return this.PrestamosRepository.updateAll(Prestamos, where);
  }

  @get('/Prestamos/{id}')
  @response(200, {
    description: 'Prestamos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prestamos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Prestamos> {
    return this.PrestamosRepository.findById(id, {
      include: [
        {relation: 'cliente'},
        {relation: 'tipoPrestamo'},
        {relation: 'cuotas'},
      ],
    });
  }

  @patch('/Prestamos/{id}')
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
    await this.PrestamosRepository.updateById(id, Prestamos);
  }

  @put('/Prestamos/{id}')
  @response(204, {
    description: 'Prestamos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Prestamos: Prestamos,
  ): Promise<void> {
    await this.PrestamosRepository.replaceById(id, Prestamos);
  }

  @del('/Prestamos/{id}')
  @response(204, {
    description: 'Prestamos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.PrestamosRepository.deleteById(id);
  }

  @get('/get-Prestamos/{id}')
  async dataPrestamosId(@param.path.number('id') id: number): Promise<any> {
    let datos = await this.getPrestamosId(id);
    return datos;
  }
  async getPrestamosId(id: number) {
    return await this.PrestamosRepository.dataSource.execute(
      `${viewOf.getPrestamos} Where Prestamos.Estado = ${id}`,
    );
  }

  @get('/Prestamos/search')
  async dataPrestamosSearch(
    @param.query.string('search') search: string,
  ): Promise<any> {
    let PrestamosSearch = await this.getPrestamosSearch(search);
    return PrestamosSearch;
  }

  async getPrestamosSearch(search: string) {
    return await this.PrestamosRepository.dataSource.execute(
      `${viewOf.getViewPrestamos} Where Nombres like '%${search}%' or Apellidos like '%${search}%' or Nombre like '%${search}%'  or Monto like '%${search}%'  or TotalMonto like '%${search}%' or FechaInicial like '%${search}%' or FechaFinal like '%${search}%'`,
    );
  }

  @get('/get-Prestamos')
  async dataPrestamos(): Promise<any> {
    let datos = await this.getPrestamos();
    return datos;
  }

  async getPrestamos() {
    return await this.PrestamosRepository.dataSource.execute(
      `${viewOf.getPrestamos}`,
    );
  }
}
