import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Clientes, Usuario, UsuarioCliente, UsuarioClienteRelations} from '../models';
import { ClientesRepository } from './clientes.repository';
import { UsuarioRepository } from './usuario.repository';

export class UsuarioClienteRepository extends DefaultCrudRepository<
  UsuarioCliente,
  typeof UsuarioCliente.prototype.id,
  UsuarioClienteRelations
> {
  public readonly cliente: BelongsToAccessor<Clientes, typeof UsuarioCliente.prototype.id>;
  public readonly usuario: BelongsToAccessor<Usuario, typeof UsuarioCliente.prototype.id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>,
    @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(UsuarioCliente, dataSource);
    this.cliente = this.createBelongsToAccessorFor('Cliente', clientesRepositoryGetter);
    this.registerInclusionResolver('Cliente', this.cliente.inclusionResolver);

    this.usuario = this.createBelongsToAccessorFor('Usuario', usuarioRepositoryGetter);
    this.registerInclusionResolver('Usuario', this.usuario.inclusionResolver);
  }


  // Metodo para transferir cartera
  //Este metodo tiene que actualizar el id1 en la tabla UsuarioCliente todas las veces que encuentre el id2
  
  transferirCartera(id:number, id2:number):void{
    this.updateAll({usuarioId:id2},{usuarioId:id});
  }

}
