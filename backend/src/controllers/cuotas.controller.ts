import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {viewOf} from '../core/library/views.library';
import {Cuotas} from '../models';
import {CuotasRepository} from '../repositories/cuotas.repository';
import { authenticate } from '@loopback/authentication';


@authenticate('jwt')
export class CuotasController {
  constructor(
    @repository(CuotasRepository)
    public CuotasRepository: CuotasRepository,
  ) {}

  @post('/cuotas')
  @response(200, {
    description: 'Cuotas model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cuotas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cuotas, {
            title: 'NewCuotas',
            exclude: ['id'],
          }),
        },
      },
    })
    Cuotas: Omit<Cuotas, 'id'>,
  ): Promise<Cuotas> {
    return this.CuotasRepository.create(Cuotas);
  }

  @get('/cuotas/count')
  @response(200, {
    description: 'Cuotas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Cuotas) where?: Where<Cuotas>): Promise<Count> {
    return this.CuotasRepository.count(where);
  }

  @get('/cuotas')
  @response(200, {
    description: 'Array of Cuotas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cuotas, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Cuotas) filter?: Filter<Cuotas>): Promise<Cuotas[]> {
    return this.CuotasRepository.find(filter);
  }

  @get('/cuotas/paginated')
  @response(200, {
    description: 'List of Cuotas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cuotas, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Cuotas[]> {
    return this.CuotasRepository.find({skip, limit});
  }

  @patch('/cuotas')
  @response(200, {
    description: 'Cuotas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cuotas, {partial: true}),
        },
      },
    })
    Cuotas: Cuotas,
    @param.where(Cuotas) where?: Where<Cuotas>,
  ): Promise<Count> {
    return this.CuotasRepository.updateAll(Cuotas, where);
  }

  @get('/cuotas/{id}')
  @response(200, {
    description: 'Cuotas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cuotas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cuotas, {exclude: 'where'})
    filter?: FilterExcludingWhere<Cuotas>,
  ): Promise<Cuotas> {
    return this.CuotasRepository.findById(id, filter);
  }

  @patch('/cuotas/{id}')
  @response(204, {
    description: 'Cuotas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cuotas, {partial: true}),
        },
      },
    })
    Cuotas: Cuotas,
  ): Promise<void> {
    await this.CuotasRepository.updateById(id, Cuotas);
  }

  @put('/cuotas/{id}')
  @response(204, {
    description: 'Cuotas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Cuotas: Cuotas,
  ): Promise<void> {
    await this.CuotasRepository.replaceById(id, Cuotas);
  }

  @del('/cuotas/{id}')
  @response(204, {
    description: 'Cuotas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.CuotasRepository.deleteById(id);
  }

  @get('/get-cuotas/{id}')
  async dataCuotasId(@param.path.number('id') id: number): Promise<any> {
    let datos = await this.getCuotasId(id);
    return datos;
  }
  async getCuotasId(id: number) {
    return await this.CuotasRepository.dataSource.execute(
      `${viewOf.getCuotas} Where p.[Estado] = ${id}`,
    );
  }

  @get('/cuotas/search')
  async dataCuotasSearch(
    @param.query.string('search') search: string,
  ): Promise<any> {
    let CuotasSearch = await this.getCuotasSearch(search);
    return CuotasSearch;
  }

  async getCuotasSearch(search: string) {
    return await this.CuotasRepository.dataSource.execute(
      `${viewOf.getViewCuotasActivas} Where Cuotas like '%${search}%'`,
    );
  }

  @get('/get-cuotas')
  async dataCuotas(): Promise<any> {
    let datos = await this.getCuotas();
    return datos;
  }

  async getCuotas() {
    return await this.CuotasRepository.dataSource.execute(
      `${viewOf.getCuotas}`,
    );
  }
}
