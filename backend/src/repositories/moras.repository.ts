import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Clientes, FechasPagos, Moras, MorasRelations, PlanesPago, Prestamos} from '../models';
import { ClientesRepository } from './clientes.repository';
import { PrestamosRepository } from './prestamos.repository';
import { PlanesPagoRepository } from './planes-pago.repository';
import { FechasPagosRepository } from './fechas-pagos.repository';

export class MorasRepository extends DefaultCrudRepository<
  Moras,
  typeof Moras.prototype.id,
  MorasRelations
> {
  public readonly cliente: BelongsToAccessor<Clientes, typeof Moras.prototype.Id>; 
  public readonly prestamos: BelongsToAccessor<Prestamos, typeof Moras.prototype.Id>;
  public readonly planPago: BelongsToAccessor<PlanesPago, typeof Moras.prototype.Id>;
  public readonly fechaPago: BelongsToAccessor<FechasPagos, typeof Moras.prototype.Id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>,
    @repository.getter('PrestamosRepository') protected prestamosRepositoryGetter: Getter<PrestamosRepository>,
    @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>,
    @repository.getter('FechasPagosRepository') protected fechasPagosRepositoryGetter: Getter<FechasPagosRepository>,
  ) {
    super(Moras, dataSource);
    this.cliente = this.createBelongsToAccessorFor('cliente', clientesRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);

    this.prestamos = this.createBelongsToAccessorFor('prestamo', prestamosRepositoryGetter);
    this.registerInclusionResolver('prestamo', this.prestamos.inclusionResolver);

    this.planPago = this.createBelongsToAccessorFor('planPago', planesPagoRepositoryGetter);
    this.registerInclusionResolver('planPago', this.planPago.inclusionResolver);

    this.fechaPago = this.createBelongsToAccessorFor('fechaPago', fechasPagosRepositoryGetter);
    this.registerInclusionResolver('fechaPago', this.fechaPago.inclusionResolver);
  }
}
