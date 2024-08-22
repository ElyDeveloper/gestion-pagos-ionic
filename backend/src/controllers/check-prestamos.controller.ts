import { DataObject, repository } from "@loopback/repository";
import { FechasPagosRepository, PrestamosRepository } from "../repositories";
import { FechasPagos, Prestamos } from "../models";
import { param, patch, post, requestBody } from "@loopback/rest";


export class CheckPrestamosController{
    constructor(
        @repository(PrestamosRepository)
        public prestamosRepository: PrestamosRepository,
        @repository(FechasPagosRepository)
        public fechasPagosRepository: FechasPagosRepository,
    ){}

    // Crear fechas de pagos
    @post('/check-prestamos/crear-fechas-pagos')
    async createFechasPagos(
        @requestBody({
        content: {
            'application/json': {
            schema: {
                type: 'object',
                properties: {
                planId: {type: 'number'},
                estado: {type: 'boolean'},
                cuota: {type: 'number'},
                fechaInicio: {type: 'string', format: 'date'},
                periodoCobro: {type: 'number'},
                numeroCuotas: {type: 'number'},
                },
            },
            },
        },
        })
        
        datos: {
        planId: number,
        estado: boolean,
        cuota: number,
        fechaInicio: string,
        periodoCobro: number,
        numeroCuotas: number,
        },
    ): Promise<void> {
        const {planId, estado, cuota, fechaInicio, periodoCobro, numeroCuotas} = datos;
        console.log('Periodo de Cobro: ', periodoCobro)
        let fechaActual = new Date(fechaInicio);
        const fechasPagos = [];
    
        for (let i = 0; i < numeroCuotas; i++) {
        // Crear una copia de la fecha actual
        const fechaPago = new Date(fechaActual);
    
        fechasPagos.push({
            planId: planId,
            estado: estado,
            cuota: cuota,
            fechaPago: fechaPago,
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
    
        const fechasPagosData: DataObject<FechasPagos>[] = fechasPagos.map(fp => ({
            ...fp,
            fechaPago: fp.fechaPago.toISOString(), // Convert Date to string
        }));
        // console.log('fechas pagos: ', fechasPagos);
        await this.fechasPagosRepository.createAll(fechasPagosData);
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
                estado: {type: 'boolean', description: 'Estado del préstamo (aprobado o rechazado)'},
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