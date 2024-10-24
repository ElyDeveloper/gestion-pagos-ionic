import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {Personas, PersonasRelations, RecordCrediticio, Nacionalidades, EstadoCivil, TipoPersonas, UsuarioCliente} from '../models';
import {RecordCrediticioRepository} from './record-crediticio.repository';
import {NacionalidadesRepository} from './nacionalidades.repository';
import {EstadoCivilRepository} from './estado-civil.repository';
import {TipoPersonasRepository} from './tipo-personas.repository';
import {UsuarioClienteRepository} from './usuario-cliente.repository';

export class PersonasRepository extends DefaultCrudRepository<
  Personas,
  typeof Personas.prototype.id,
  PersonasRelations
> {

  public readonly recordCrediticio: BelongsToAccessor<RecordCrediticio, typeof Personas.prototype.id>;

  public readonly nacionalidad: BelongsToAccessor<Nacionalidades, typeof Personas.prototype.id>;

  public readonly estadoCivil: BelongsToAccessor<EstadoCivil, typeof Personas.prototype.id>;

  public readonly tipoPersona: BelongsToAccessor<TipoPersonas, typeof Personas.prototype.id>;

  public readonly usuarioCliente: HasOneRepositoryFactory<UsuarioCliente, typeof Personas.prototype.id>;

  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource, @repository.getter('RecordCrediticioRepository') protected recordCrediticioRepositoryGetter: Getter<RecordCrediticioRepository>, @repository.getter('NacionalidadesRepository') protected nacionalidadesRepositoryGetter: Getter<NacionalidadesRepository>, @repository.getter('EstadoCivilRepository') protected estadoCivilRepositoryGetter: Getter<EstadoCivilRepository>, @repository.getter('TipoPersonasRepository') protected tipoPersonasRepositoryGetter: Getter<TipoPersonasRepository>, @repository.getter('UsuarioClienteRepository') protected usuarioClienteRepositoryGetter: Getter<UsuarioClienteRepository>,
  ) {
    super(Personas, dataSource);
    this.usuarioCliente = this.createHasOneRepositoryFactoryFor('usuarioCliente', usuarioClienteRepositoryGetter);
    this.registerInclusionResolver('usuarioCliente', this.usuarioCliente.inclusionResolver);
    this.tipoPersona = this.createBelongsToAccessorFor('tipoPersona', tipoPersonasRepositoryGetter,);
    this.registerInclusionResolver('tipoPersona', this.tipoPersona.inclusionResolver);
    this.estadoCivil = this.createBelongsToAccessorFor('estadoCivil', estadoCivilRepositoryGetter,);
    this.registerInclusionResolver('estadoCivil', this.estadoCivil.inclusionResolver);
    this.nacionalidad = this.createBelongsToAccessorFor('nacionalidad', nacionalidadesRepositoryGetter,);
    this.registerInclusionResolver('nacionalidad', this.nacionalidad.inclusionResolver);
    this.recordCrediticio = this.createBelongsToAccessorFor('recordCrediticio', recordCrediticioRepositoryGetter,);
    this.registerInclusionResolver('recordCrediticio', this.recordCrediticio.inclusionResolver);
  }

}