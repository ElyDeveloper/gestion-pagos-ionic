import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Prestamos,
  PlanesPago,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosPlanesPagoController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/planes-pago', {
    responses: {
      '200': {
        description: 'PlanesPago belonging to Prestamos',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PlanesPago),
          },
        },
      },
    },
  })
  async getPlanesPago(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
  ): Promise<PlanesPago> {
    return this.prestamosRepository.planPago(id);
  }
}
