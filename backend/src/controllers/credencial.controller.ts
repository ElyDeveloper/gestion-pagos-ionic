import {service} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Credenciales} from '../models';
import {CredencialesRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import {JWTService} from '../services';
import { AuthorizationError } from '../core/library/authorization-error';


// @authenticate('jwt')
export class CredencialController {
  constructor(
    @repository(CredencialesRepository)
    public credencialesRepository: CredencialesRepository,
    @service(JWTService)
    private jwtService: JWTService,
  ) {}

  @post('/credenciales')
  @response(200, {
    description: 'Credenciales model instance',
    content: {'application/json': {schema: getModelSchemaRef(Credenciales)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {
            title: 'NewCredenciales',
            exclude: ['Id'],
          }),
        },
      },
    })
    credenciales: Omit<Credenciales, 'Id'>,
  ): Promise<Credenciales> {
    return this.credencialesRepository.create(credenciales);
  }

  @get('/credenciales/count')
  @response(200, {
    description: 'Credenciales model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Credenciales) where?: Where<Credenciales>,
  ): Promise<Count> {
    return this.credencialesRepository.count(where);
  }

  @get('/credenciales/all')
  @response(200, {
    description: 'Array of Credenciales model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Credenciales, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Credenciales) filter?: Filter<Credenciales>,
  ): Promise<Credenciales[]> {
    return this.credencialesRepository.find();
  }

  @patch('/credenciales')
  @response(200, {
    description: 'Credenciales PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {partial: true}),
        },
      },
    })
    credenciales: Credenciales,
    @param.where(Credenciales) where?: Where<Credenciales>,
  ): Promise<Count> {
    return this.credencialesRepository.updateAll(credenciales, where);
  }

  @get('/credenciales/{id}')
  @response(200, {
    description: 'Credenciales model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Credenciales, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Credenciales, {exclude: 'where'})
    filter?: FilterExcludingWhere<Credenciales>,
  ): Promise<Credenciales> {
    try {
      const idUser = this.jwtService.decryptId(id);
      //console.log('id User: ', idUser);
      const credenciales = await this.credencialesRepository.findById(
        idUser,
        filter,
      );
      if (!credenciales) {
        throw new HttpErrors.NotFound('Credenciales no encontradas');
      }
      return credenciales;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw new HttpErrors.Unauthorized('Usuario inválido');
      }
      if (error instanceof HttpErrors.NotFound) {
        throw error; // Re-lanza el error NotFound
      }
      // Log del error para debugging interno
      console.error('Error en findById:', error);
      // Lanza un error genérico para el cliente
      throw new HttpErrors.InternalServerError(
        'Error al procesar la solicitud',
      );
    }
  }

  @patch('/credenciales/{id}')
  @response(204, {
    description: 'Credenciales PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {partial: true}),
        },
      },
    })
    credenciales: Credenciales,
  ): Promise<void> {
    await this.credencialesRepository.updateById(id, credenciales);
  }

  @put('/credenciales/{id}')
  @response(204, {
    description: 'Credenciales PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() credenciales: Credenciales,
  ): Promise<void> {
    await this.credencialesRepository.replaceById(id, credenciales);
  }

  @del('/credenciales/{id}')
  @response(204, {
    description: 'Credenciales DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.credencialesRepository.deleteById(id);
  }
}
