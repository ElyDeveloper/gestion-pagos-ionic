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
import {Pagos} from '../models/pagos.model';
import {PagosRepository} from '../repositories/pagos.repository';
import { authenticate } from '@loopback/authentication';
import { Documentos, DocumentosTipoDoc } from '../models';
import { ContratosPagoRepository } from '../repositories/contratos-pago.repository';
import { FILE_UPLOAD_SERVICE } from '../core/library/keys';
import { FileUploadHandler } from '../core/library/types';
import { inject } from '@loopback/core';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';


@authenticate('jwt')
export class PagosController {
  constructor(
    @repository(PagosRepository)
    public PagosRepository: PagosRepository,
    @repository(Documentos)
    public DocumentosRepository: Documentos,
    @repository(DocumentosTipoDoc)
    public DocumentosTipoDocRepository: DocumentosTipoDoc,
    @repository(ContratosPagoRepository)
    public contratosPagoRepository: ContratosPagoRepository,
    @inject(FILE_UPLOAD_SERVICE) private fileHandler:FileUploadHandler

  ) {}

  @post('/pagos')
  @response(200, {
    description: 'Pagos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Pagos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {
            title: 'NewPagos',
            exclude: ['id'],
          }),
        },
      },
    })
    Pagos: Omit<Pagos, 'id'>,
  ): Promise<Pagos> {
    return this.PagosRepository.create(Pagos);
  }

  @post('/pagos/crear')
  async crearPago(
    @requestBody({
      description: 'Datos del pago y el archivo a subir (opcional)',
      content:{
        'multipart/form-data':{
          schema: {
            type: 'object',
            properties:{
              estado: {type: 'boolean'},
              fechaPago: {type: 'string', format: 'date'},
              idFechaPago: {type: 'number'},
              monto: {type: 'number'},
              idPrestamo: {type: 'number'},
              documento: {type: 'string', format: 'binary'},
            },
            required: ['estado', 'fechaPago', 'idFechaPago', 'monto', 'idPrestamo'],
          },
        },
      },
    })
    requestData:any,
  ):Promise<void>{
    const {
      estado,
      fechaPago,
      idFechaPago,
      monto,
      idPrestamo,
      documento,
    } = requestData;
    
    const contratoPago = await this.contratosPagoRepository.findOne({
      where: {idPrestamo: idPrestamo},
    });

    if(!contratoPago){
      throw new Error(`Prestamo con id ${idPrestamo} no encontrado`);
    }

    let filePath = null;
    if(documento){
      //Si el archivo existe se guarda
      filePath = await this.saveFile(documento);

      //Insertar en la tabla Documentos
      const nuevoDocumento = await this.DocumentosRepository.create({
        urlDocumento: filePath,
        fechaSubida: new Date().toISOString().split('T')[0],
        idTipoDoc: null
      })

      //Insertar en la tabla DocumentosTipoDoc
      await this.DocumentosTipoDocRepository.create({
        idDocumento: nuevoDocumento.id,
        idTipoDoc: 1,
      })
    }

    await this.PagosRepository.create({
      estado: estado,
      fechaPago: fechaPago,
      idFechaPago: idFechaPago,
      monto: monto,
    });


    
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(__dirname, '../../uploads');
    if(!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }

    const uniqueName = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    const fileName = `${uniqueName}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    return new Promise<string>((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if(err)reject(err);
          resolve(filePath);
      });
    })
  }

  @get('/pagos/count')
  @response(200, {
    description: 'Pagos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Pagos) where?: Where<Pagos>): Promise<Count> {
    return this.PagosRepository.count(where);
  }

  @get('/pagos')
  @response(200, {
    description: 'Array of Pagos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pagos, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Pagos[]> {
    return this.PagosRepository.find(
      {
        include:[
          {relation: 'prestamos'},
        ],
      }
    );
  }

  @get('/pagos/paginated')
  @response(200, {
    description: 'List of Pagos model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pagos, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Pagos[]> {
    return this.PagosRepository.find({
      include:[
        {relation: 'prestamos'},
      ],
      skip,
      limit
    });
  }

  @patch('/pagos')
  @response(200, {
    description: 'Pagos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {partial: true}),
        },
      },
    })
    Pagos: Pagos,
    @param.where(Pagos) where?: Where<Pagos>,
  ): Promise<Count> {
    return this.PagosRepository.updateAll(Pagos, where);
  }

  @get('/pagos/{id}')
  @response(200, {
    description: 'Pagos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pagos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Pagos> {
    return this.PagosRepository.findById(id);
  }

  @patch('/pagos/{id}')
  @response(204, {
    description: 'Pagos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pagos, {partial: true}),
        },
      },
    })
    Pagos: Pagos,
  ): Promise<void> {
    await this.PagosRepository.updateById(id, Pagos);
  }

  @put('/pagos/{id}')
  @response(204, {
    description: 'Pagos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Pagos: Pagos,
  ): Promise<void> {
    await this.PagosRepository.replaceById(id, Pagos);
  }

  @del('/pagos/{id}')
  @response(204, {
    description: 'Pagos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.PagosRepository.deleteById(id);
  }

  @get('/pagos/search')
  async dataPagosSearch(
    @param.query.string('search') search: string,
  ): Promise<any> {
    let PagosSearch = await this.getPagosSearch(search);
    return PagosSearch;
  }

  async getPagosSearch(search: string) {
    return await this.PagosRepository.dataSource.execute(
      `${viewOf.getViewPagos} Where ClienteNombre like '%${search}%' or ClienteApellidos like '%${search}%' or TipoPrestamoNombre like '%${search}%'  or Monto like '%${search}%'  or FechaPago like '%${search}%' or FechaInicial like '%${search}%' or FechaFinal like '%${search}%'`,
    );
  }

  
}
