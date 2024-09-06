import {DataObject, repository} from '@loopback/repository';
import {
  ContratosPagoRepository,
  DocumentosRepository,
  DocumentosTipoDocRepository,
  FechasPagosRepository,
  MorasRepository,
  PagosRepository,
  PlanesPagoRepository,
  PrestamosRepository,
} from '../repositories';
import {FechasPagos, Prestamos} from '../models';
import {
  HttpErrors,
  get,
  param,
  patch,
  post,
  requestBody,
  RestBindings,
  Response,
} from '@loopback/rest';
import {inject, service} from '@loopback/core';
import {JWTService} from '../services';
import multer from 'multer';
import {Request as ExpressRequest, Response as ExpressResponse} from 'express';
import {keys} from '../env/interfaces/Servicekeys.interface';
import * as fs from 'fs';
import * as path from 'path';

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join(__dirname, '../../../../../../DocumetosPrestamo'));
    cb(null, path.join(keys.URL_FILE, 'Pagos'));
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
    @repository(MorasRepository)
    public morasRepository: MorasRepository,
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
              data: {type: 'string'},
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
          console.error('Error al cargar el archivo:', err);
          return reject({error: 'Error al cargar el archivo.'});
        }

        try {
          const dataSend = JSON.parse(req.body.data);
          const {fechaPago, idFechaPago, monto, mora, idPrestamo} = dataSend;
          const file = req.file;

          // Buscar el IdDocumento usando el IDPrestamo
          const contrato = await this.contratosPagoRepository.findOne({
            where: {idPrestamo},
          });

          //INFO OBTENER FECHA PAGO ACTUAL
          const fechasPago =
            await this.fechasPagosRepository.findById(idFechaPago);

          const prestamo = await this.prestamosRepository.findById(idPrestamo);

          if (!contrato) {
            throw new HttpErrors.NotFound(
              `Contrato de pago no encontrado para el préstamo ID ${idPrestamo}`,
            );
          }
          //Calcular dias de retraso
          const fechaContrato = new Date(fechasPago.fechaPago);
          const diasRetraso = Math.round(
            (new Date().getTime() - fechaContrato.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          // console.log('Dias de retraso:', diasRetraso);

          //INFO INSERTAR EN PAGOS
          const pago = await this.pagosRepository.create({
            estado: true,
            fechaPago: new Date(fechaPago).toISOString(),
            monto: monto,
            idFechaPago: idFechaPago,
          });

          const pagosRealizados = await this.pagosRepository.find({
            where: {
              idFechaPago,
            },
          });

          const totalPagado = pagosRealizados.reduce(
            (acc, current) => acc + current.monto,
            0,
          );

          const deuda = fechasPago.monto + mora;

          console.log('Total pagado:', totalPagado);
          console.log('Deuda:', deuda);

          if (totalPagado >= deuda) {
            //INFO INSERTAR EN FECHAS_PAGOS
            await this.fechasPagosRepository.updateById(idFechaPago, {
              estado: true,
            });

            //INFO INSERTAR EN MORAS
            if (mora > 0) {
              await this.morasRepository.create({
                idCliente: prestamo.idCliente,
                idPrestamo,
                idPlan: prestamo.idPlan,
                idFechaPago,
                diasRetraso,
                mora,
                estado: true,
              });
            }

            //INFO CONTAR CUOTAS PAGADAS EN FECHAS PAGOS
            const countCuotasPagadas = await this.fechasPagosRepository.count({
              planId: prestamo.idPlan,
              estado: true,
            });

            console.log('Cuotas pagadas:', countCuotasPagadas.count);

            //INFO ACTUALIZAR PLAN DE PAGO
            await this.planesPagoRepository.updateById(prestamo.idPlan, {
              cuotaPagadas: countCuotasPagadas.count,
            });
          }

          // Crear el registro en documentosTipoDoc
          const docTipo = await this.documentosTipoDocRepository.create({
            idDocumento: pago.id,
            idTipoDocumento: 1, // Tipo de documento: 1 = Comprobante de Pago
          });

          // Crear el registro en Documentos
          await this.documentosRepository.create({
            urlDocumento: file ? file.path : undefined,
            fechaSubida: new Date().toISOString(),
            idDocTipDoc: docTipo.id,
          });

          resolve({
            message: 'Archivo cargado y datos guardados exitosamente.',
            filename: file ? file.filename : null,
            path: file ? file.path : null,
          });
        } catch (error) {
          console.error('Error al procesar la solicitud:', error);
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
      monto,
      fechaInicio,
      periodoCobro,
      numeroCuotas,
      idEstadoAprobacion,
    } = datos;

    await this.validateExistingPayments(planId);

    const prestamoId = this.jwtService.decryptId(idPrestamo);
    const fechasPagos = this.generatePaymentDates(
      fechaInicio,
      periodoCobro,
      numeroCuotas,
      monto,
      planId,
    );
    const latestDate = this.getLatestPaymentDate(fechasPagos);

    await this.updatePlanAndLoan(
      planId,
      prestamoId,
      fechaInicio,
      latestDate,
      idEstadoAprobacion,
    );

    return this.saveOrUpdatePaymentDates(planId, fechasPagos);
  }

  private async validateExistingPayments(planId: number): Promise<void> {
    const historialPagos = await this.fechasPagosRepository.find({
      where: {planId, estado: true},
    });

    if (historialPagos.length !== 0) {
      throw new HttpErrors.Conflict(
        'Ya existe pago registrado para este plan.',
      );
    }
  }

  private generatePaymentDates(
    fechaInicio: string,
    periodoCobro: number,
    numeroCuotas: number,
    monto: number,
    planId: number,
  ): Array<{planId: number; estado: boolean; monto: number; fechaPago: Date}> {
    let fechaActual = new Date(fechaInicio);
    const fechasPagos = [];

    for (let i = 0; i < numeroCuotas; i++) {
      fechaActual = this.incrementDate(fechaActual, periodoCobro);
      const fechaPago = new Date(fechaActual);
      fechasPagos.push({planId, estado: false, monto, fechaPago});
    }

    return fechasPagos;
  }

  private incrementDate(date: Date, periodoCobro: number): Date {
    const newDate = new Date(date);
    switch (periodoCobro) {
      case 1:
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 2:
        newDate.setDate(newDate.getDate() + 15);
        break;
      case 3:
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      default:
        throw new Error('Periodo de Cobro no válido');
    }
    return newDate;
  }

  private getLatestPaymentDate(
    fechasPagos: Array<{fechaPago: Date}>,
  ): string | undefined {
    return fechasPagos.length > 0
      ? fechasPagos[fechasPagos.length - 1].fechaPago.toISOString()
      : undefined;
  }

  private async updatePlanAndLoan(
    planId: number,
    prestamoId: number,
    fechaInicio: string,
    latestDate: string | undefined,
    idEstadoAprobacion: number,
  ): Promise<void> {
    await this.planesPagoRepository.updateById(planId, {
      fechaInicio,
      fechaFin: latestDate,
    });

    await this.prestamosRepository.updateById(prestamoId, {
      idEstadoAprobacion,
      fechaAprobacion: new Date().toISOString(),
    });
  }

  private async saveOrUpdatePaymentDates(
    planId: number,
    fechasPagos: Array<{
      planId: number;
      estado: boolean;
      monto: number;
      fechaPago: Date;
    }>,
  ): Promise<any> {
    const fechasPagosData: DataObject<FechasPagos>[] = fechasPagos.map(fp => ({
      ...fp,
      fechaPago: fp.fechaPago.toISOString(),
    }));

    const existeHistorial = await this.fechasPagosRepository.count({
      where: {planId},
    });

    if (existeHistorial.count === 0) {
      return this.fechasPagosRepository.createAll(fechasPagosData);
    } else {
      await this.fechasPagosRepository.deleteAll({planId});
      return this.fechasPagosRepository.createAll(fechasPagosData);
    }
  }

  //Modificar la url del archivo
  @patch('/pagos/updateFile', {
    responses: {
      '204': {
        description: 'Pago PATCH success',
      },
    },
  })
  async updatePagoFile(
    @requestBody({
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              data: {type: 'string'},
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
          const dataSend = JSON.parse(req.body.data);
          const {fechaPago, idFechaPago} = dataSend;
          const file = req.file;

          const pago = await this.pagosRepository.findOne({
            where: {idFechaPago},
          });

          console.log('Archivo cargado:', file);
          console.log('Fecha de pago:', new Date(fechaPago));
          console.log('Pago:', pago);

          const documento = await this.documentosRepository.findOne({
            where: {idDocumento: pago?.id},
          });

          //Actualizar la fechaPago de la tabla Pagos
          if (fechaPago != undefined && pago?.id != undefined) {
            await this.pagosRepository.updateById(pago?.id, {
              fechaPago: new Date(fechaPago).toISOString(),
            });
          }

          //Actualizar el campo UrlDocumento en la tabla documentos si esta presente
          if (file !== undefined) {
            await this.documentosRepository.updateById(documento?.id, {
              urlDocumento: file ? file?.path : undefined,
              fechaSubida: new Date().toISOString(),
            });

            resolve({
              message: 'Archivo cargado y datos guardados exitosamente.',
              filename: file ? file?.filename : null,
              path: file ? file?.path : null,
            });
          } else {
            resolve({
              message: 'Archivo no cargado. Datos guardados exitosamente.',
            });
          }
        } catch (error) {
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

  // Método para obtener un archivo
  @get('/getFile', {
    responses: {
      '200': {
        description: 'Return the requested file',
        content: {'*/*': {}},
      },
    },
  })
  async getFile(
    @param.query.string('filepath') filepath: string, // Recibe el parámetro filepath desde la query string
    @inject(RestBindings.Http.RESPONSE) response: Response, // Inyecta la respuesta HTTP
  ): Promise<any> {
    try {
      // Construye la ruta completa del archivo
      const fullPath = path.resolve(filepath);

      // Verifica si el archivo existe
      if (!fs.existsSync(fullPath)) {
        response.status(404).send('File not found');
        return;
      }

      // Obtén la extensión del archivo para determinar el tipo MIME
      const mimeType = this.getMimeType(fullPath);

      // Establece los encabezados para la respuesta, incluyendo el tipo MIME adecuado
      response.setHeader('Content-Type', mimeType);

      // Devuelve el archivo como respuesta
      return fs.createReadStream(fullPath).pipe(response);
    } catch (error) {
      response.status(500).send(`Error fetching file: ${error.message}`);
    }
  }

  // Método para obtener el tipo MIME basado en la extensión del archivo
  getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.pdf':
        return 'application/pdf';
      case '.txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }
}
