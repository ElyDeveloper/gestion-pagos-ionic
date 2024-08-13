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

import {ClientesRepository} from '../repositories/clientes.repository';
import {Clientes} from '../models';

// @authenticate('admin', 'owner')
export class ClientesController {
  constructor(
    @repository(ClientesRepository)
    public ClientesRepository: ClientesRepository,
  ) {}

  @post('/clientes')
  @response(200, {
    description: 'Clientes model instance',
    content: {'application/json': {schema: getModelSchemaRef(Clientes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clientes, {
            title: 'NewClientes',
            exclude: ['id'],
          }),
        },
      },
    })
    Clientes: Omit<Clientes, 'id'>,
  ): Promise<Clientes> {
    return this.ClientesRepository.create(Clientes);
  }

  @get('/clientes/count')
  @response(200, {
    description: 'Clientes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Clientes) where?: Where<Clientes>): Promise<Count> {
    return this.ClientesRepository.count(where);
  }

  @get('/clientes')
  @response(200, {
    description: 'Array of Clientes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Clientes, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Clientes) filter?: Filter<Clientes>,
  ): Promise<Clientes[]> {
    return this.ClientesRepository.find();
  }

  @get('/clientes/paginated')
  @response(200, {
    description: 'List of Clientes model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Clientes, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Clientes[]> {
    return this.ClientesRepository.find({
      include: [{relation: 'prestamos'}],
      skip,
      limit,
    });
  }

  @patch('/clientes')
  @response(200, {
    description: 'Clientes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clientes, {partial: true}),
        },
      },
    })
    Clientes: Clientes,
    @param.where(Clientes) where?: Where<Clientes>,
  ): Promise<Count> {
    return this.ClientesRepository.updateAll(Clientes, where);
  }

  @get('/clientes/{id}')
  @response(200, {
    description: 'Clientes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Clientes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Clientes, {exclude: 'where'})
    filter?: FilterExcludingWhere<Clientes>,
  ): Promise<Clientes> {
    return this.ClientesRepository.findById(id, filter);
  }

  @patch('/clientes/{id}')
  @response(204, {
    description: 'Clientes PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Clientes, {partial: true}),
        },
      },
    })
    Clientes: Clientes,
  ): Promise<void> {
    await this.ClientesRepository.updateById(id, Clientes);
  }

  @put('/clientes/{id}')
  @response(204, {
    description: 'Clientes PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Clientes: Clientes,
  ): Promise<void> {
    await this.ClientesRepository.replaceById(id, Clientes);
  }

  @del('/clientes/{id}')
  @response(204, {
    description: 'Clientes DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ClientesRepository.deleteById(id);
  }

  @get('/get-Clientes/{id}')
  async dataClientesId(@param.path.number('id') id: number): Promise<any> {
    let datos = await this.getClientesId(id);
    return datos;
  }
  async getClientesId(id: number) {
    return await this.ClientesRepository.dataSource.execute(
      `${viewOf.getClientes} Where estado = ${id}`,
    );
  }

  @get('/clientes/search')
  async dataClientesSearch(
    @param.query.string('query') search: string,
  ): Promise<any> {
    // let clientesSearch = await this.getClientesSearch(search);
    // console.log('clientesSearch', clientesSearch);
    // return clientesSearch;

    console.log('search', search);

    const clientesSearch = await this.ClientesRepository.find({
      where: {
        or: [
          {dni: {like: `%${search}%`}},
          {nombres: {like: `%${search}%`}},
          {apellidos: {like: `%${search}%`}},
        ],
      },
      include: [{relation: 'prestamos'}],
    });
    console.log('clientesSearch', clientesSearch);
    return clientesSearch;
  }

  async getClientesSearch(search: string) {
    return await this.ClientesRepository.dataSource.execute(
      `${viewOf.getViewClientes} Where DNI like '%${search}%' or Nombres like '%${search}%' or Apellidos like '%${search}%'`,
    );
  }

  @get('/get-Clientes')
  async dataClientes(): Promise<any> {
    let datos = await this.getClientes();
    return datos;
  }

  async getClientes() {
    return await this.ClientesRepository.dataSource.execute(
      `${viewOf.getClientes}`,
    );
  }
}
