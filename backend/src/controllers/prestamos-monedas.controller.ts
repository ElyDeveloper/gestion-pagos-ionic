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
  Monedas,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosMonedasController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/monedas', {
    responses: {
      '200': {
        description: 'Monedas belonging to Prestamos',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Monedas),
          },
        },
      },
    },
  })
  async getMonedas(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
  ): Promise<Monedas> {
    return this.prestamosRepository.moneda(id);
  }
}
