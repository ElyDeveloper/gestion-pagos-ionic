import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Prestamos, PrestamosRelations, Personas, Productos, PlanesPago, Monedas, PeriodosCobro, EstadosAprobacion, Pagos} from '../models';
import {PersonasRepository} from './personas.repository';
import {ProductosRepository} from './productos.repository';
import {PlanesPagoRepository} from './planes-pago.repository';
import {MonedasRepository} from './monedas.repository';
import {PeriodosCobroRepository} from './periodos-cobro.repository';
import {EstadosAprobacionRepository} from './estados-aprobacion.repository';
import {PagosRepository} from './pagos.repository';

export class PrestamosRepository extends DefaultCrudRepository<
  Prestamos,
  typeof Prestamos.prototype.id,
  PrestamosRelations
> {

  public readonly cliente: BelongsToAccessor<Personas, typeof Prestamos.prototype.id>;

  public readonly producto: BelongsToAccessor<Productos, typeof Prestamos.prototype.id>;

  public readonly planPago: BelongsToAccessor<PlanesPago, typeof Prestamos.prototype.id>;

  public readonly moneda: BelongsToAccessor<Monedas, typeof Prestamos.prototype.id>;

  public readonly periodoCobro: BelongsToAccessor<PeriodosCobro, typeof Prestamos.prototype.id>;

  public readonly estadoAprobacion: BelongsToAccessor<EstadosAprobacion, typeof Prestamos.prototype.id>;

  public readonly aval: BelongsToAccessor<Personas, typeof Prestamos.prototype.id>;

  public readonly pagos: HasManyRepositoryFactory<Pagos, typeof Prestamos.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('PersonasRepository') protected personasRepositoryGetter: Getter<PersonasRepository>, @repository.getter('ProductosRepository') protected productosRepositoryGetter: Getter<ProductosRepository>, @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>, @repository.getter('MonedasRepository') protected monedasRepositoryGetter: Getter<MonedasRepository>, @repository.getter('PeriodosCobroRepository') protected periodosCobroRepositoryGetter: Getter<PeriodosCobroRepository>, @repository.getter('EstadosAprobacionRepository') protected estadosAprobacionRepositoryGetter: Getter<EstadosAprobacionRepository>, @repository.getter('PagosRepository') protected pagosRepositoryGetter: Getter<PagosRepository>,
  ) {
    super(Prestamos, dataSource);
    this.pagos = this.createHasManyRepositoryFactoryFor('pagos', pagosRepositoryGetter,);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);
    this.aval = this.createBelongsToAccessorFor('aval', personasRepositoryGetter,);
    this.registerInclusionResolver('aval', this.aval.inclusionResolver);
    this.estadoAprobacion = this.createBelongsToAccessorFor('estadoAprobacion', estadosAprobacionRepositoryGetter,);
    this.registerInclusionResolver('estadoAprobacion', this.estadoAprobacion.inclusionResolver);
    this.periodoCobro = this.createBelongsToAccessorFor('periodoCobro', periodosCobroRepositoryGetter,);
    this.registerInclusionResolver('periodoCobro', this.periodoCobro.inclusionResolver);
    this.moneda = this.createBelongsToAccessorFor('moneda', monedasRepositoryGetter,);
    this.registerInclusionResolver('moneda', this.moneda.inclusionResolver);
    this.planPago = this.createBelongsToAccessorFor('planPago', planesPagoRepositoryGetter,);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);
    this.producto = this.createBelongsToAccessorFor('producto', productosRepositoryGetter,);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.cliente = this.createBelongsToAccessorFor('cliente', personasRepositoryGetter,);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
