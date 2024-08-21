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
  PeriodosCobro,
} from '../models';
import {PrestamosRepository} from '../repositories';

export class PrestamosPeriodosCobroController {
  constructor(
    @repository(PrestamosRepository)
    public prestamosRepository: PrestamosRepository,
  ) { }

  @get('/prestamos/{id}/periodos-cobro', {
    responses: {
      '200': {
        description: 'PeriodosCobro belonging to Prestamos',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PeriodosCobro),
          },
        },
      },
    },
  })
  async getPeriodosCobro(
    @param.path.number('id') id: typeof Prestamos.prototype.id,
  ): Promise<PeriodosCobro> {
    return this.prestamosRepository.periodoCobro(id);
  }
}
