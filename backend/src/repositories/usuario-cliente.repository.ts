import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import { Personas, Usuario, UsuarioCliente, UsuarioClienteRelations} from '../models';
import { UsuarioRepository } from './usuario.repository';
import { PersonasRepository } from './personas.repository';

export class UsuarioClienteRepository extends DefaultCrudRepository<
  UsuarioCliente,
  typeof UsuarioCliente.prototype.id,
  UsuarioClienteRelations
> {
  public readonly cliente: BelongsToAccessor<Personas, typeof UsuarioCliente.prototype.id>;
  public readonly usuario: BelongsToAccessor<Usuario, typeof UsuarioCliente.prototype.id>;
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
    @repository.getter('PersonasRepository') protected clientesRepositoryGetter: Getter<PersonasRepository>,
    @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(UsuarioCliente, dataSource);
    this.cliente = this.createBelongsToAccessorFor('cliente', clientesRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);

    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }


  // Metodo para transferir cartera
  //Este metodo tiene que actualizar el id1 en la tabla UsuarioCliente todas las veces que encuentre el id2
  
  transferirCartera(id:number, id2:number):void{
    this.updateAll({usuarioId:id2},{usuarioId:id});
  }

}
