import {DataObject, repository} from '@loopback/repository';
import {
  FechasPagosRepository,
  PlanesPagoRepository,
  PrestamosRepository,
} from '../repositories';
import {FechasPagos, Prestamos} from '../models';
import {param, patch, post, requestBody} from '@loopback/rest';
import {service} from '@loopback/core';
import {JWTService} from '../services';

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
  ) {}

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
      cuota: number;
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
      cuota,
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
        cuota: cuota,
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
