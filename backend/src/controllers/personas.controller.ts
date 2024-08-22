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
  HttpErrors,
} from '@loopback/rest';
import {Personas} from '../models';
import {PersonasRepository} from '../repositories';

export class PersonasController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
  ) {}

  @post('/personas')
  @response(200, {
    description: 'Personas model instance',
    content: {'application/json': {schema: getModelSchemaRef(Personas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {
            title: 'NewPersonas',
            exclude: ['id'],
          }),
        },
      },
    })
    personas: Omit<Personas, 'id'>,
  ): Promise<Personas> {
    console.log('create persona: ', personas);
    return this.personasRepository.create(personas);
  }

  @get('/personas/count')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Personas) where?: Where<Personas>): Promise<Count> {
    return this.personasRepository.count(where);
  }

  @get('/personas/clientes/count')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countClientes(
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    return this.personasRepository.count({
      idTipoPersona: 1,
    });
  }

  @get('/personas/avales/count')
  @response(200, {
    description: 'Personas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async countAvales(
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    return this.personasRepository.count({
      idTipoPersona: 2,
    });
  }

  @get('/personas')
  @response(200, {
    description: 'Array of Personas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Personas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Personas) filter?: Filter<Personas>,
  ): Promise<Personas[]> {
    return this.personasRepository.find();
  }

  @get('/personas/todos/paginated')
  @response(200, {
    description: 'List of Personas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Personas, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Personas[]> {
    return this.personasRepository.find({
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
      skip,
      limit,
    });
  }

  @get('/personas/clientes/paginated')
  @response(200, {
    description: 'List of Personas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Personas, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginateClientes(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Personas[]> {
    console.log('Consulta paginada: ', skip);
    const clientes = await this.personasRepository.find({
      where: {
        idTipoPersona: 1,
      },
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
      skip,
      limit,
    });

    console.log('Clientes: ', clientes);

    return clientes;
  }

  @get('/personas/avales/paginated')
  @response(200, {
    description: 'List of Personas model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Personas, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginateAvales(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Personas[]> {
    return this.personasRepository.find({
      where: {
        idTipoPersona: 2,
      },
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
      skip,
      limit,
    });
  }

  @patch('/personas')
  @response(200, {
    description: 'Personas PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {partial: true}),
        },
      },
    })
    personas: Personas,
    @param.where(Personas) where?: Where<Personas>,
  ): Promise<Count> {
    return this.personasRepository.updateAll(personas, where);
  }

  @get('/personas/{id}')
  @response(200, {
    description: 'Personas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Personas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Personas, {exclude: 'where'})
    filter?: FilterExcludingWhere<Personas>,
  ): Promise<Personas> {
    return this.personasRepository.findById(id, filter);
  }

  @patch('/personas/{id}')
  @response(204, {
    description: 'Personas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Personas, {partial: true}),
        },
      },
    })
    personas: Personas,
  ): Promise<void> {
    await this.personasRepository.updateById(id, personas);
  }

  @put('/personas/{id}')
  @response(204, {
    description: 'Personas PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() personas: Personas,
  ): Promise<void> {
    console.log('personas', id, personas);

    try {
      await this.personasRepository.replaceById(id, personas);
    } catch (error) {
      console.error('Error updating persona:', error);
      throw new HttpErrors.InternalServerError('Error updating persona');
    }
  }

  @del('/personas/{id}')
  @response(204, {
    description: 'Personas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.personasRepository.deleteById(id);
  }

  @get('/personas/todos/search')
  async dataPersonasSearch(
    @param.query.string('query') search: string,
  ): Promise<any> {
    // let PersonasSearch = await this.getPersonasSearch(search);
    // console.log('PersonasSearch', PersonasSearch);
    // return PersonasSearch;

    console.log('search', search);

    const PersonasSearch = await this.personasRepository.find({
      where: {
        or: [
          {dni: {like: `%${search}%`}},
          {nombres: {like: `%${search}%`}},
          {apellidos: {like: `%${search}%`}},
        ],
      },
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
    });
    console.log('PersonasSearch', PersonasSearch);
    return PersonasSearch;
  }

  @get('/personas/clientes/search')
  async dataClientesSearch(
    @param.query.string('query') search: string,
  ): Promise<any> {
    // let PersonasSearch = await this.getPersonasSearch(search);
    // console.log('PersonasSearch', PersonasSearch);
    // return PersonasSearch;

    console.log('search', search);

    const PersonasSearch = await this.personasRepository.find({
      where: {
        and: [
          {idTipoPersona: 1},
          {
            or: [
              {dni: {like: `%${search}%`}},
              {nombres: {like: `%${search}%`}},
              {apellidos: {like: `%${search}%`}},
            ],
          },
        ],
      },
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
    });
    console.log('PersonasSearch', PersonasSearch);
    return PersonasSearch;
  }

  @get('/personas/avales/search')
  async dataAvalesSearch(
    @param.query.string('query') search: string,
  ): Promise<any> {
    // let PersonasSearch = await this.getPersonasSearch(search);
    // console.log('PersonasSearch', PersonasSearch);
    // return PersonasSearch;

    console.log('search', search);

    const PersonasSearch = await this.personasRepository.find({
      where: {
        and: [
          {idTipoPersona: 2},
          {
            or: [
              {dni: {like: `%${search}%`}},
              {nombres: {like: `%${search}%`}},
              {apellidos: {like: `%${search}%`}},
            ],
          },
        ],
      },
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
    });
    console.log('PersonasSearch', PersonasSearch);
    return PersonasSearch;
  }
}
