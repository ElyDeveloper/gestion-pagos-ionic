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
import {DocumentosTipoDoc} from '../models';
import {DocumentosTipoDocRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';


// @authenticate('jwt')
export class DocumentosTipoDocController {
  constructor(
    @repository(DocumentosTipoDocRepository)
    public documentosTipoDocRepository : DocumentosTipoDocRepository,
  ) {}

  @post('/documentos-tipo-docs')
  @response(200, {
    description: 'DocumentosTipoDoc model instance',
    content: {'application/json': {schema: getModelSchemaRef(DocumentosTipoDoc)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentosTipoDoc, {
            title: 'NewDocumentosTipoDoc',
            
          }),
        },
      },
    })
    documentosTipoDoc: DocumentosTipoDoc,
  ): Promise<DocumentosTipoDoc> {
    return this.documentosTipoDocRepository.create(documentosTipoDoc);
  }

  @get('/documentos-tipo-docs/count')
  @response(200, {
    description: 'DocumentosTipoDoc model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DocumentosTipoDoc) where?: Where<DocumentosTipoDoc>,
  ): Promise<Count> {
    return this.documentosTipoDocRepository.count(where);
  }

  @get('/documentos-tipo-docs')
  @response(200, {
    description: 'Array of DocumentosTipoDoc model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DocumentosTipoDoc, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<DocumentosTipoDoc[]> {
    return this.documentosTipoDocRepository.find({
      include: [{relation: 'tipoDocumentos'}, {relation: 'pagos'}],
    });
  }

  @get('/documentos-tipo-docs/paginated')
  @response(200, {
    description: 'DocumentosTipoDoc model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items:getModelSchemaRef(DocumentosTipoDoc, {includeRelations: true}),
        } 
      },
    },
  })
  async findPaginated(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  )
  : Promise<DocumentosTipoDoc[]> {
    return this.documentosTipoDocRepository.find({
      include: [{relation: 'tipoDocumentos'}, {relation: 'pagos'}],
      skip,
      limit
    });
  }

  @patch('/documentos-tipo-docs')
  @response(200, {
    description: 'DocumentosTipoDoc PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentosTipoDoc, {partial: true}),
        },
      },
    })
    documentosTipoDoc: DocumentosTipoDoc,
    @param.where(DocumentosTipoDoc) where?: Where<DocumentosTipoDoc>,
  ): Promise<Count> {
    return this.documentosTipoDocRepository.updateAll(documentosTipoDoc, where);
  }

  @get('/documentos-tipo-docs/{id}')
  @response(200, {
    description: 'DocumentosTipoDoc model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DocumentosTipoDoc, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<DocumentosTipoDoc> {
    return this.documentosTipoDocRepository.findById(id, {
      include: [{relation: 'tipoDocumentos'}, {relation: 'pagos'}],
    });
  }

  @patch('/documentos-tipo-docs/{id}')
  @response(204, {
    description: 'DocumentosTipoDoc PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentosTipoDoc, {partial: true}),
        },
      },
    })
    documentosTipoDoc: DocumentosTipoDoc,
  ): Promise<void> {
    await this.documentosTipoDocRepository.updateById(id, documentosTipoDoc);
  }

  @put('/documentos-tipo-docs/{id}')
  @response(204, {
    description: 'DocumentosTipoDoc PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() documentosTipoDoc: DocumentosTipoDoc,
  ): Promise<void> {
    await this.documentosTipoDocRepository.replaceById(id, documentosTipoDoc);
  }

  @del('/documentos-tipo-docs/{id}')
  @response(204, {
    description: 'DocumentosTipoDoc DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.documentosTipoDocRepository.deleteById(id);
  }
}
