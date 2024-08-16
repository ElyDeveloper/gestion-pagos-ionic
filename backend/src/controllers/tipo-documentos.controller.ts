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
import {TipoDocumentos} from '../models';
import {TipoDocumentosRepository} from '../repositories';

export class TipoDocumentosController {
  constructor(
    @repository(TipoDocumentosRepository)
    public tipoDocumentosRepository : TipoDocumentosRepository,
  ) {}

  @post('/tipo-documentos')
  @response(200, {
    description: 'TipoDocumentos model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoDocumentos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumentos, {
            title: 'NewTipoDocumentos',
            
          }),
        },
      },
    })
    tipoDocumentos: TipoDocumentos,
  ): Promise<TipoDocumentos> {
    return this.tipoDocumentosRepository.create(tipoDocumentos);
  }

  @get('/tipo-documentos/count')
  @response(200, {
    description: 'TipoDocumentos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoDocumentos) where?: Where<TipoDocumentos>,
  ): Promise<Count> {
    return this.tipoDocumentosRepository.count(where);
  }

  @get('/tipo-documentos')
  @response(200, {
    description: 'Array of TipoDocumentos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoDocumentos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoDocumentos) filter?: Filter<TipoDocumentos>,
  ): Promise<TipoDocumentos[]> {
    return this.tipoDocumentosRepository.find(filter);
  }

  @patch('/tipo-documentos')
  @response(200, {
    description: 'TipoDocumentos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumentos, {partial: true}),
        },
      },
    })
    tipoDocumentos: TipoDocumentos,
    @param.where(TipoDocumentos) where?: Where<TipoDocumentos>,
  ): Promise<Count> {
    return this.tipoDocumentosRepository.updateAll(tipoDocumentos, where);
  }

  @get('/tipo-documentos/{id}')
  @response(200, {
    description: 'TipoDocumentos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoDocumentos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoDocumentos, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoDocumentos>
  ): Promise<TipoDocumentos> {
    return this.tipoDocumentosRepository.findById(id, filter);
  }

  @patch('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumentos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumentos, {partial: true}),
        },
      },
    })
    tipoDocumentos: TipoDocumentos,
  ): Promise<void> {
    await this.tipoDocumentosRepository.updateById(id, tipoDocumentos);
  }

  @put('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumentos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoDocumentos: TipoDocumentos,
  ): Promise<void> {
    await this.tipoDocumentosRepository.replaceById(id, tipoDocumentos);
  }

  @del('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumentos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoDocumentosRepository.deleteById(id);
  }
}
