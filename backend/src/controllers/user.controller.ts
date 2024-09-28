import {inject} from '@loopback/core';
import {service} from '@loopback/core/dist';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {randomBytes} from 'crypto';
import {viewOf} from '../core/library/views.library';
import {Usuario} from '../models/usuarios.model';
import {CredencialesRepository} from '../repositories/credenciales.repository';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {EncriptDecryptService} from '../services/encript-decrypt.service';
import {MailService} from '../services/mail.service';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class UserController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(CredencialesRepository)
    public credencialesRepository: CredencialesRepository,
    @inject('services.MailService')
    private mailService: MailService,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService,
  ) {}

  // Modifica el método create para generar credenciales y enviar correo
  @post('/usuarios')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    const newUser = await this.usuarioRepository.create({
      ...usuario,
      changedPassword: false,
    });
    const correo = newUser.correo;
    const user = correo?.split('@');
    const username = user ? user[0] : '';
    const password = randomBytes(4).toString('hex');
    let newHash = this.encriptDecryptService.Encrypt(password);

    await this.credencialesRepository.create({
      correo: newUser.correo,
      username,
      hash: newHash,
    });

    await this.mailService.sendWelcomeEmail(newUser.correo || '', password);

    return newUser;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Usuario) where?: Where<Usuario>): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  @get('/usuarios/roles/{id}')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async findByRol(@param.path.number('id') id: number): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: {rolid: id},
    });
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Usuario> {
    return this.usuarioRepository.findById(id, {
      include: [{relation: 'rol'}],
    });
  }

  @get('/usuarios/paginated')
  @response(200, {
    description: 'List of Usuario model',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async dataPaginate(
    @param.query.number('skip') skip: number,
    @param.query.number('limit') limit: number,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      include: [{relation: 'rol'}],
      skip,
      limit,
      order: ['id DESC'],
    });
  }

  //Busqueda por texto
  @get('/usuarios/search')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async search(@param.query.string('query') query: string): Promise<Usuario[]> {
    // //console.log('query', query);
    return this.usuarioRepository.find({
      include: [{relation: 'rol'}],
      where: {
        or: [
          {nombre: {like: `%${query}%`}},
          {apellido: {like: `%${query}%`}},
          {correo: {like: `%${query}%`}},
        ],
      },
    });
  }

  @get('/usuarios/asesores/search')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async searchAsesores(
    @param.query.string('query') query: string,
  ): Promise<Usuario[]> {
    // //console.log('query', query);
    return this.usuarioRepository.find({
      include: [{relation: 'rol'}],
      where: {
        and: [
          {
            or: [
              {nombre: {like: `%${query}%`}},
              {apellido: {like: `%${query}%`}},
              {correo: {like: `%${query}%`}},
            ],
          },
          {rolid: 3}, // Asesor
        ],
      },
    });
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    const usuarioLocate = await this.usuarioRepository.findById(id);
    const credenciales = await this.credencialesRepository.findOne({
      where: {
        correo: usuarioLocate.correo,
      },
    });

    //console.log('credenciales: ', credenciales);

    if (credenciales) {
      await this.credencialesRepository.updateById(credenciales.id, {
        username: usuario.correo?.split('@')[0],
        correo: usuario.correo,
      });
    }

    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  @get('/getcredential/{id}')
  async ParamtersTable(@param.path.string('id') id: number): Promise<any> {
    let datos = await this.getTPdetail(id);
    return datos;
  }

  async getTPdetail(id: number) {
    let result = await this.credencialesRepository.dataSource.execute(
      `${viewOf.GET_CREDENTIAL} Where us.id = '${id}'`,
    );
    //console.log('**********************', result);

    return result;
  }
}
