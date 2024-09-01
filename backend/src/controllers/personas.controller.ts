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
import {
  PersonasRepository,
  UsuarioClienteRepository,
  UsuarioRepository,
} from '../repositories';
import {JWTService} from '../services';
import {inject, service} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class PersonasController {
  constructor(
    @repository(PersonasRepository)
    public personasRepository: PersonasRepository,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(UsuarioClienteRepository)
    public usuarioClienteRepository: UsuarioClienteRepository,
    @service(JWTService)
    private jwtService: JWTService,
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
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Personas[]> {
    console.log('Usuario Logueado: ', currentUser);
    const userId = parseInt(currentUser[securityId], 10);
    console.log('Id de Usuario Logueado: ', userId);

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.Unauthorized('Usuario no encontrado');
    }
    console.log('Usuario encontrado: ', user);

    if (user.rolid === 3) {
      const usuariosCliente = await this.usuarioClienteRepository.find({
        where: {usuarioId: userId},
        include: [
          {
            relation: 'Cliente',
            scope: {
              include: [
                {relation: 'nacionalidad'},
                {relation: 'recordCrediticio'},
                {relation: 'estadoCivil'},
                {relation: 'tipoPersona'},
              ],
            },
          },
        ],
        skip,
        limit,
      });

      const clients = usuariosCliente.map((uc: any) => uc.Cliente);

      //Encriptar id de clientes
      clients.forEach((c: any) => {
        c.id = this.jwtService.encryptId(c.id || 0);
      });

      return clients;
    }

    const personas = await this.personasRepository.find({
      include: [
        {relation: 'nacionalidad'},
        {relation: 'recordCrediticio'},
        {relation: 'estadoCivil'},
        {relation: 'tipoPersona'},
      ],
      skip,
      limit,
    });

    // clonar array
    const copia: any = Array.from(personas);

    //encriptar id de prestamos con jwtService
    copia.forEach((persona: any) => {
      persona.id = this.jwtService.encryptId(persona.id || 0);
    });

    return copia;
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
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Personas[]> {
    console.log('Usuario Logueado: ', currentUser);
    const userId = parseInt(currentUser[securityId], 10);
    console.log('Id de Usuario Logueado: ', userId);

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

    // clonar array
    const copia: any = Array.from(clientes);

    //encriptar id de prestamos con jwtService
    copia.forEach((persona: any) => {
      persona.id = this.jwtService.encryptId(persona.id || 0);
    });

    return copia;
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
    const avales = await this.personasRepository.find({
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

    // clonar array
    const copia: any = Array.from(avales);

    //encriptar id de prestamos con jwtService
    copia.forEach((persona: any) => {
      persona.id = this.jwtService.encryptId(persona.id || 0);
    });

    return copia;
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
    @param.path.string('id') id: string,
    @requestBody() personas: any,
  ): Promise<void> {
    console.log('personas', id, personas);

    const decryptedId = this.jwtService.decryptId(id);

    personas.id = decryptedId;

    try {
      await this.personasRepository.replaceById(decryptedId, personas);
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

    // clonar array
    const copia: any = Array.from(PersonasSearch);

    //encriptar id de prestamos con jwtService
    copia.forEach((persona: any) => {
      persona.id = this.jwtService.encryptId(persona.id || 0);
    });

    return copia;
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
    // clonar array
    const copia: any = Array.from(PersonasSearch);

    //encriptar id de prestamos con jwtService
    copia.forEach((persona: any) => {
      persona.id = this.jwtService.encryptId(persona.id || 0);
    });

    return copia;
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
    // clonar array
    const copia: any = Array.from(PersonasSearch);

    //encriptar id de prestamos con jwtService
    copia.forEach((persona: any) => {
      persona.id = this.jwtService.encryptId(persona.id || 0);
    });

    return copia;
  }
}
