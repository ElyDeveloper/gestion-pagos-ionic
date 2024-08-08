import {service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {
  RegisterUserInterface,
  credentialShema,
} from '../core/interfaces/models/RegisterUser.interface';
import {CredencialesRepository} from '../repositories/credenciales.repository';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {AuthService, JWTService} from '../services';

export class AuthController {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @service(JWTService)
    private jwtService: JWTService,
    @service(AuthService)
    private authService: AuthService,
  ) {}

  @post('/register')
  @response(200, {
    description: 'Usuario model instance',
  })
  async RegisterUser(
    @requestBody() registerUser: RegisterUserInterface,
  ): Promise<any> {
    return this.authService.RegisterUser(registerUser);
  }

  @post('/login')
  @response(200, {
    description: 'Usuario model instance',
  })
  async Login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              identificator: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['identificator', 'password'],
          },
        },
      },
    })
    loginInterface: LoginInterface,
  ): Promise<any> {
    //FIX: Fix Login
    return this.authService.Login(loginInterface);
  }

  @post('/reset-password')
  @response(200, {
    description: 'Usuario model instance',
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              identificator: {type: 'number'},
              newPassword: {type: 'string'},
            },
            required: ['identificator', 'newPassword'],
          },
        },
      },
    })
    reset: any,
  ): Promise<any> {
    console.log('desde frontend', reset);

    // Obtener todos los usuarios
    let users = await this.credencialesRepository.find();
    console.log('Usuarios', users);

    let user = users.find(u => u.id === reset.identificator);
    console.log('Usuario', user);

    if (!user) {
      return {error: 'Usuario no encontrado'};
    }

    let result = await this.jwtService.ResetPassword(
      user.correo ?? '',
      reset.newPassword,
    );

    if (!result) {
      return {error: 'Error al cambiar la contraseña'};
    } else {
      return true;
    }
  }

  @post('/create-credentials')
  @response(200, {
    description: 'Usuario model instance',
  })
  async CreateCredentials(
    @requestBody() credentials: credentialShema,
  ): Promise<any> {
    return this.authService.createCredentials(credentials);
  }

  @post('/update-credentials')
  @response(200, {
    description: 'Usuario model instance',
  })
  async UpdateCredentials(
    @requestBody() credentials: credentialShema,
  ): Promise<any> {
    return this.authService.updateCredencials(credentials);
  }
}
