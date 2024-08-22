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
import {PrestamosRepository} from '../repositories/prestamos.repository';
import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {JWTService} from '../services';

// @authenticate('jwt')
export class PrestamosController {
  constructor(
    @repository(PrestamosRepository)
    public PrestamosRepository: PrestamosRepository,
    @service(JWTService)
    private jwtService: JWTService,
  ) {}

  @post('/prestamos')
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

  @get('/prestamos/count')
  @response(200, {
    description: 'Prestamos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Prestamos) where?: Where<Prestamos>,
  ): Promise<Count> {
    return this.PrestamosRepository.count(where);
  }

  @get('/prestamos')
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
        {relation: 'producto'},
        {relation: 'periodo'},
        {relation: 'estadoAprobacion'},
        {relation: 'planPago'},
        {relation: 'moneda'},
      ],
    });
  }

  @get('/prestamos/paginated')
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
    const prestamos = await this.PrestamosRepository.find({
      include: [
        {relation: 'cliente'},
        {relation: 'producto'},
        {relation: 'periodo'},
        {relation: 'estadoAprobacion'},
        {relation: 'planPago'},
        {relation: 'moneda'},
      ],
      skip,
      limit,
    });

    // clonar array
    const copia: any = Array.from(prestamos);

    //encriptar id de prestamos con jwtService
    copia.forEach((prestamo: any) => {
      prestamo.id = this.jwtService.encryptId(prestamo.id || 0);
    });

    return copia;
  }

  @patch('/prestamos')
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

  @get('/prestamos/{id}')
  @response(200, {
    description: 'Prestamos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Prestamos, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Prestamos> {
    console.log('Id Encrypted: ', id);
    const idDecrypted = this.jwtService.decryptId(id);
    console.log('Id Decrypted: ', idDecrypted)
    return this.PrestamosRepository.findById(idDecrypted, {
      include: [
        {relation: 'cliente'},
        {relation: 'producto'},
        {relation: 'periodo'},
        {relation: 'estadoAprobacion'},
        {relation: 'planPago'},
        {relation: 'moneda'},
      ],
    });
  }

  @patch('/prestamos/{id}')
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

  @put('/prestamos/{id}')
  @response(204, {
    description: 'Prestamos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Prestamos: Prestamos,
  ): Promise<void> {
    await this.PrestamosRepository.replaceById(id, Prestamos);
  }

  @del('/prestamos/{id}')
  @response(204, {
    description: 'Prestamos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.PrestamosRepository.deleteById(id);
  }

  @get('/prestamos/search')
  async dataPrestamosSearch(
    @param.query.string('query') search: string,
  ): Promise<any> {
    let PrestamosSearch = await this.PrestamosRepository.find({
      include: [
        {relation: 'cliente'},
        {relation: 'producto'},
        {relation: 'periodo'},
        {relation: 'estadoAprobacion'},
        {relation: 'planPago'},
        {relation: 'moneda'},
      ],
      where: {
        or: [
          {nombres: {like: `%${search}%`}},
          {apellidos: {like: `%${search}%`}},
        ],
      },
    });
    return PrestamosSearch;
  }


}
