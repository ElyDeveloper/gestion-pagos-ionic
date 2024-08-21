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
  Productos,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosProductosController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/productos', {
    responses: {
      '200': {
        description: 'Productos belonging to Prestamos',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Productos),
          },
        },
      },
    },
  })
  async getProductos(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
  ): Promise<Productos> {
    return this.prestamosRepository.producto(id);
  }
}
