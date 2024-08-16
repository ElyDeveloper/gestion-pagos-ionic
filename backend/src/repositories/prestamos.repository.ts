import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Clientes, Cuotas, EstadosAprobacion, Monedas, Pagos, PeriodosCobro, PlanesPago, Prestamos, PrestamosRelations, Productos} from '../models';
import { ClientesRepository } from './clientes.repository';
import { ProductosRepository } from './productos.repository';
import { PeriodosCobroRepository } from './periodos-cobro.repository';
import { EstadosAprobacionRepository } from './estados-aprobacion.repository';
import { PlanesPagoRepository } from './planes-pago.repository';
import { MonedasRepository } from './monedas.repository';

export class PrestamosRepository extends DefaultCrudRepository<
  Prestamos,
  typeof Prestamos.prototype.id,
  PrestamosRelations
> {
  public readonly cliente: BelongsToAccessor<Clientes, typeof Prestamos.prototype.Id>;
  public readonly productos: BelongsToAccessor<Productos, typeof Productos.prototype.Id>;
  public readonly periodos: BelongsToAccessor<PeriodosCobro, typeof PeriodosCobro.prototype.Id>;
  public readonly estado: BelongsToAccessor<EstadosAprobacion, typeof EstadosAprobacion.prototype.Id>;
  public readonly planPago: BelongsToAccessor<PlanesPago, typeof PlanesPago.prototype.Id>;
  public readonly moneda: BelongsToAccessor<Monedas, typeof Monedas.prototype.Id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>,
    @repository.getter('ProductosRepository') protected productosRepositoryGetter: Getter<ProductosRepository>,
    @repository.getter('PeriodosCobroRepository') protected periodosRepositoryGetter: Getter<PeriodosCobroRepository>,
    @repository.getter('EstadosAprobacionRepository') protected estadosRepositoryGetter: Getter<EstadosAprobacionRepository>,
    @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>,
    @repository.getter('MonedasRepository') protected monedasRepositoryGetter: Getter<MonedasRepository>,
  ) {
    super(Prestamos, dataSource);
    this.cliente = this.createBelongsToAccessorFor('cliente', clientesRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);

    this.productos = this.createBelongsToAccessorFor('producto', productosRepositoryGetter);
    this.registerInclusionResolver('producto', this.productos.inclusionResolver);

    this.periodos = this.createBelongsToAccessorFor('periodo', periodosRepositoryGetter);
    this.registerInclusionResolver('periodo', this.periodos.inclusionResolver);

    this.estado = this.createBelongsToAccessorFor('estadoAprobacion', estadosRepositoryGetter);
    this.registerInclusionResolver('estadoAprobacion', this.estado.inclusionResolver);

    this.planPago = this.createBelongsToAccessorFor('planPago', planesPagoRepositoryGetter);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);

    this.moneda = this.createBelongsToAccessorFor('moneda', monedasRepositoryGetter);
    this.registerInclusionResolver('moneda', this.moneda.inclusionResolver);
  }
}
