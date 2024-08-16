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
} from '@loopback/rest';
import {Documentos} from '../models';
import {DocumentosRepository} from '../repositories';

export class DocumentosController {
  constructor(
    @repository(DocumentosRepository)
    public documentosRepository : DocumentosRepository,
  ) {}

  @post('/documentos')
  @response(200, {
    description: 'Documentos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Documentos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documentos, {
            title: 'NewDocumentos',
            
          }),
        },
      },
    })
    documentos: Documentos,
  ): Promise<Documentos> {
    return this.documentosRepository.create(documentos);
  }

  @get('/documentos/count')
  @response(200, {
    description: 'Documentos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Documentos) where?: Where<Documentos>,
  ): Promise<Count> {
    return this.documentosRepository.count(where);
  }

  @get('/documentos')
  @response(200, {
    description: 'Array of Documentos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Documentos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Documentos) filter?: Filter<Documentos>,
  ): Promise<Documentos[]> {
    return this.documentosRepository.find(filter);
  }

  @patch('/documentos')
  @response(200, {
    description: 'Documentos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documentos, {partial: true}),
        },
      },
    })
    documentos: Documentos,
    @param.where(Documentos) where?: Where<Documentos>,
  ): Promise<Count> {
    return this.documentosRepository.updateAll(documentos, where);
  }

  @get('/documentos/{id}')
  @response(200, {
    description: 'Documentos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Documentos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Documentos, {exclude: 'where'}) filter?: FilterExcludingWhere<Documentos>
  ): Promise<Documentos> {
    return this.documentosRepository.findById(id, filter);
  }

  @patch('/documentos/{id}')
  @response(204, {
    description: 'Documentos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documentos, {partial: true}),
        },
      },
    })
    documentos: Documentos,
  ): Promise<void> {
    await this.documentosRepository.updateById(id, documentos);
  }

  @put('/documentos/{id}')
  @response(204, {
    description: 'Documentos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() documentos: Documentos,
  ): Promise<void> {
    await this.documentosRepository.replaceById(id, documentos);
  }

  @del('/documentos/{id}')
  @response(204, {
    description: 'Documentos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.documentosRepository.deleteById(id);
  }
}
