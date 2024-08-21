import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Pagos, Vouchers, VouchersRelations} from '../models';
import { PagosRepository } from './pagos.repository';

export class VouchersRepository extends DefaultCrudRepository<
  Vouchers,
  typeof Vouchers.prototype.id,
  VouchersRelations
> {
  public readonly pagos: BelongsToAccessor<Pagos, typeof Vouchers.prototype.id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PagosRepository') protected pagosRepositoryGetter: Getter<PagosRepository>,
  ) {
    super(Vouchers, dataSource);
    this.pagos = this.createBelongsToAccessorFor('pagos', pagosRepositoryGetter);
    this.registerInclusionResolver('pagos', this.pagos.inclusionResolver);
  }
}
