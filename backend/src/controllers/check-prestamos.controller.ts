import {DataObject, repository} from '@loopback/repository';
import {
  ContratosPagoRepository,
  DocumentosRepository,
  DocumentosTipoDocRepository,
  FechasPagosRepository,
  PagosRepository,
  PlanesPagoRepository,
  PrestamosRepository,
} from '../repositories';
import {FechasPagos, Prestamos} from '../models';
import {HttpErrors, param, patch, post, requestBody, RestBindings, Response as RestResponse,} from '@loopback/rest';
import {inject, service} from '@loopback/core';
import {JWTService} from '../services';
import multer from 'multer';
import path from 'path';
import {Request as ExpressRequest, Response as ExpressResponse} from 'express';
import { keys } from '../env/interfaces/Servicekeys.interface';


// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join(__dirname, '../../../../../../DocumetosPrestamo'));
    cb(null, path.join(__dirname, `${keys.URL_FILE}`));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({storage: storage});

export class CheckPrestamosController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
    @repository(PlanesPagoRepository)
    public planesPagoRepository: PlanesPagoRepository,
    @repository(FechasPagosRepository)
    public fechasPagosRepository: FechasPagosRepository,
    @service(JWTService)
    private jwtService: JWTService,
    @repository(ContratosPagoRepository)
    public contratosPagoRepository: ContratosPagoRepository,
    @repository(DocumentosRepository)
    public documentosRepository: DocumentosRepository,
    @repository(DocumentosTipoDocRepository)
    public documentosTipoDocRepository: DocumentosTipoDocRepository,
    @repository(PagosRepository)
    public pagosRepository: PagosRepository,
  ) {}

  //Guardar el archivo
  @post('/pagos/saveFile', {
    responses: {
      '200': {
        description: 'Archivo guardado exitosamente',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async saveFile(
    @requestBody({
      description: 'Datos para crear un pago y subir un archivo',
      required: false,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              estado: {type: 'boolean'},
              fechaPago: {type: 'string', format: 'date'},
              idFechaPago: {type: 'number'},
              monto: {type: 'number'},
              idPrestamo: {type: 'number'},
              file: {type: 'string', format: 'binary'},
            },
          },
        },
      },
    })
    req: ExpressRequest,
    @inject(RestBindings.Http.RESPONSE) res: ExpressResponse,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      upload.single('file')(req, res, async (err: any) => {
        if (err) {
          return reject({error: 'Error al cargar el archivo.'});
        }

        try {
          const {estado, fechaPago, idFechaPago, monto, idPrestamo} = req.body;
          const file = req.file;

          // Buscar el IdDocumento usando el IDPrestamo
          const contrato = await this.contratosPagoRepository.findOne({
            where: {idPrestamo},
          });

          if (!contrato) {
            throw new HttpErrors.NotFound(`Contrato de pago no encontrado para el préstamo ID ${idPrestamo}`);
          }
         
          // Crear el registro en Pagos
          const pago = await this.pagosRepository.create({
            estado: estado,
            fechaPago: new Date(fechaPago).toISOString(),
            monto: monto,
            idFechaPago: idFechaPago,
          });
          const idPago = pago.id;

          // Crear el registro en documentosTipoDoc
          const docTipo = await this.documentosTipoDocRepository.create({
            idDocumento: idPago,
            idTipoDocumento: 1, // Tipo de documento: 1 = Comprobante de Pago
          });
          const idDocumentoTipoDoc = docTipo.id;

          // Crear el registro en Documentos
          await this.documentosRepository.create({
            urlDocumento: file ? file.path : undefined,
            fechaSubida: new Date().toISOString(),
            idDocTipDoc: idDocumentoTipoDoc,
          });

          resolve({
            message: 'Archivo cargado y datos guardados exitosamente.',
            filename: file ? file.filename : null,
            path: file ? file.path : null,
          });
        } catch (error) {
          return reject({error: 'Error al procesar la solicitud.'});
        }
      });
    });
  }

  // Crear fechas de pagos
  @post('/check-prestamos/crear-fechas-pagos')
  async createFechasPagos(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              idPrestamo: {type: 'string'},
              planId: {type: 'number'},
              estado: {type: 'boolean'},
              cuota: {type: 'number'},
              fechaInicio: {type: 'string'},
              periodoCobro: {type: 'number'},
              numeroCuotas: {type: 'number'},
              idEstadoAprobacion: {type: 'number'},
            },
          },
        },
      },
    })
    datos: {
      idPrestamo: string;
      planId: number;
      estado: boolean;
      monto: number;
      fechaInicio: string;
      periodoCobro: number;
      numeroCuotas: number;
      idEstadoAprobacion: number;
    },
  ): Promise<any> {
    const {
      idPrestamo,
      planId,
      estado,
      monto,
      fechaInicio,
      periodoCobro,
      numeroCuotas,
      idEstadoAprobacion,
    } = datos;
    // console.log('Datos recibidos: ', datos);

    const prestamoId = this.jwtService.decryptId(idPrestamo);

    // return;
    let fechaActual = new Date(fechaInicio);
    const fechasPagos = [];

    for (let i = 0; i < numeroCuotas; i++) {
      // Crear una copia de la fecha actual
      const fechaPago = new Date(fechaActual);

      fechasPagos.push({
        planId: planId,
        estado: false,
        monto,
        fechaPago,
      });

      // Incrementar la fecha según el periodo de cobro
      switch (periodoCobro) {
        case 1:
          fechaActual.setDate(fechaActual.getDate() + 7);
          break;
        case 2:
          fechaActual.setDate(fechaActual.getDate() + 15);
          break;
        case 3:
          fechaActual.setMonth(fechaActual.getMonth() + 1);
          break;
        default:
          throw new Error('Periodo de Cobro no válido');
      }
    }

    const latestDate =
      fechasPagos.length > 0
        ? fechasPagos[fechasPagos.length - 1].fechaPago.toISOString()
        : undefined;
    console.log('Ultima fecha: ', latestDate);

    const fechasPagosData: DataObject<FechasPagos>[] = fechasPagos.map(fp => ({
      ...fp,
      fechaPago: fp.fechaPago.toISOString(), // Convert Date to string
    }));

    await this.planesPagoRepository.updateById(planId, {
      fechaInicio,
      fechaFin: latestDate,
    });

    // Actualizar el estado del préstamo según el estado de aprobación
    await this.prestamosRepository.updateById(prestamoId, {
      idEstadoAprobacion,
      fechaAprobacion: new Date().toISOString(), // Convert Date to string
    });

    if (idEstadoAprobacion === 1 || idEstadoAprobacion === 3) {
      return {message: 'Datos actualizados correctamente'};
    }

    const existeHistorial = await this.fechasPagosRepository.count({
      where: {planId},
    });

    if (existeHistorial.count === 0) {
      return await this.fechasPagosRepository.createAll(fechasPagosData);
    } else {
      //Eliminar los elementos del historial por planId
      await this.fechasPagosRepository.deleteAll({planId});
      // Crear nuevos elementos en el historial
      return await this.fechasPagosRepository.createAll(fechasPagosData);
    }
    // console.log('fechas pagos: ', fechasPagos);
  }

  //Modificar la url del archivo
  @patch('/pagos/updateFile/{id}', {
    responses: {
      '204': {
        description: 'Pago PATCH success',
      },
    },
  })
  async updatePagoFile(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'multipart/form-data': { 
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              file: {type: 'string', format: 'binary'},
            },
          },
        },
      },
    })
    req: ExpressRequest,
    @inject(RestBindings.Http.RESPONSE) res: ExpressResponse,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      upload.single('file')(req, res, async (err: any) => {
        if (err) {
          return reject({error: 'Error al cargar el archivo.'});
        }

        try{
          const file = req.file;
      
          console.log('Url del archivo: ', file ? `${keys.URL_FILE}/${file.filename}` : undefined);
          //Actualizar el campo UrlDocumento en la tabla documentos si esta presente
          if(file !== undefined){
            await this.documentosRepository.updateById(id,{
              urlDocumento: file ? file.path : undefined,
              fechaSubida: new Date().toISOString(),
            });

            resolve({
              message: 'Archivo cargado y datos guardados exitosamente.',
              filename: file ? file.filename : null,
              path: file ? file.path : null,
            })
          }
        }
        catch(error){
          return reject({error: 'Error al procesar la solicitud.'});
        }
      });
    });
  }

  //Crear fecha aprobacion en prestamos
  @patch('/check-prestamos/{id}')
  async updatePrestamo(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              estado: {
                type: 'boolean',
                description: 'Estado del préstamo (aprobado o rechazado)',
              },
            },
            required: ['estado'],
          },
        },
      },
    })
    body: {estado: boolean},
  ): Promise<void> {
    // Crear un objeto de actualización
    const updateData: Partial<Prestamos> = {
      estado: body.estado,
    };

    // Si el estado es aprobado, setear la fecha de aprobación
    if (body.estado) {
      updateData.fechaAprobacion = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    } else {
      updateData.fechaAprobacion = null; // Omitir el campo o establecerlo en undefined si está permitido
    }

    // Actualizar el préstamo con el estado y, opcionalmente, la fecha de aprobación
    await this.prestamosRepository.updateById(id, updateData);
  }
}
