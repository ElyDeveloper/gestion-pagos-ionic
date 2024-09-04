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
import {
  DocumentosRepository,
  DocumentosTipoDocRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';

// @authenticate('jwt')
export class DocumentosController {
  constructor(
    @repository(DocumentosTipoDocRepository)
    public documentosTipoDocRepository: DocumentosTipoDocRepository,
    @repository(DocumentosRepository)
    public documentosRepository: DocumentosRepository,
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
  async find(): Promise<Documentos[]> {
    return this.documentosRepository.find({
      include: [{relation: 'documentosTipoDoc'}],
    });
  }

  @get('/documentos/by-fecha-pago/{id}')
  @response(200, {
    description: 'Documentos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Documentos, {includeRelations: true}),
      },
    },
  })
  async findByIdFechaPago(@param.path.number('id') id: number): Promise<any> {
    const docTipoDoc = await this.documentosTipoDocRepository.findOne({
      where: {idDocumento: id},
    });

    const documento = await this.documentosRepository.findOne({
      where: {idDocTipDoc: docTipoDoc?.id},
    });

    return documento;
  }

  @get('/documentos/paginated')
  @response(200, {
    description: 'Documentos model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Documentos, {includeRelations: true}),
        },
      },
    },
  })
  async findPaginated(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Documentos[]> {
    return this.documentosRepository.find({
      include: [{relation: 'documentosTipoDoc'}],
      skip,
      limit,
    });
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
  async findById(@param.path.number('id') id: number): Promise<Documentos> {
    return this.documentosRepository.findById(id, {
      include: [{relation: 'documentosTipoDoc'}],
    });
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
