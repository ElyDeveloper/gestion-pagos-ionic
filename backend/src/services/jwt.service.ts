import {BindingScope, inject, injectable, service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {LoginInterface} from '../core/interfaces/models/Login.interface';
import {Credenciales} from '../models/credenciales.model';
import {CodigoVerificacionRepository} from '../repositories/codigo-verificacion.repository';
import {CredencialesRepository} from '../repositories/credenciales.repository';
import {EncriptDecryptService} from './encript-decrypt.service';
import {UserService} from './user.service';
import {VerifyCodeInfo} from '../core/interfaces/models/gCode.interface';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import * as crypto from 'crypto';
import { keys } from '../env/interfaces/Servicekeys.interface';
var shortid = require('shortid-36');

//importar dotenv
require('dotenv').config();

const ENCRYPTION_KEY = crypto.createHash('sha256').update(keys.SECRET_KEY).digest();
const IV_LENGTH = 16;

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService {
  userService: UserService;
  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService,
    @repository(CodigoVerificacionRepository)
    private codigoVerificacionRepository: CodigoVerificacionRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private jwtService: TokenService,
  ) {}

  async createToken(credentials: any, user: any): Promise<string> {
    const userProfile: UserProfile = {
      [securityId]: credentials.id!.toString(),
      id: credentials.id?.toString(),
      name: credentials.username,
      role: credentials.role,
    };

    //console.log(
    //   'Codigo generado: ',
    //   await this.jwtService.generateToken(userProfile),
    // );
    return await this.jwtService.generateToken(userProfile);
  }

  async VerifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors[401]('Token vacio');
    }

    try {
      const userProfile: UserProfile = await this.jwtService.verifyToken(token);
      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verificando el token: ${error.message}`,
      );
    }
  }

  async IdentifyToken(
    credentials: LoginInterface,
  ): Promise<Credenciales | false> {
    let user = await this.credencialesRepository.findOne({
      where: {correo: credentials.identificator},
    });

    if (!user)
      user = await this.credencialesRepository.findOne({
        where: {username: credentials.identificator},
      });

    if (
      user?.correo === credentials.identificator ||
      user?.username === credentials.identificator
    ) {
      let cryptPass = await this.encriptDecryptService.Encrypt(
        credentials.password,
      );

      if (user.hash === cryptPass) {
        return user;
      }

    }
    return false;
  }

  async ResetPassword(
    identificator: string,
    newpassword: string,
  ): Promise<string | false> {
    let user = await this.credencialesRepository.findOne({
      where: {correo: identificator},
    });
    if (!user)
      user = await this.credencialesRepository.findOne({
        where: {username: identificator},
      });

    if (user?.correo === identificator || user?.username === identificator) {
      // Verifica que el usuario correcto se esté actualizando
      newpassword = this.encriptDecryptService.Encrypt(newpassword);
      user.hash = newpassword;
      this.credencialesRepository.replaceById(user.id, user);

      return newpassword;
    }
    return false;
  }

  // async generateCode(request: gCodeInterface) {
  //   const newCode = new CodigoVerificacion;
  //   //console.log(request.identificator);

  //   let credentialsExist = await this.credencialesRepository.findOne({where: {correo: request.identificator}});

  //   if (!credentialsExist)
  //     throw new HttpErrors[402]("Usuario no valido")

  //   newCode.exp = Date.now() + keys.ONE_MINUTE_MILLISECONDS + '';
  //   newCode.codigo = keys.GENERATE_NEW_VERIFY_CODE;
  //   let user = await this.usuarioRepository.findOne({where: {correo: request.identificator}});
  //   if (!user?.estado)
  //     throw new HttpErrors[402]("Este usuario esta desactivado");

  //   newCode.userId = user.id;

  //   return await this.codigoVerificacionRepository.create(newCode);

  // }

  generateVerificationCode(): string {
    let code = shortid.generate();
    if (code.length > 6) {
      return code.slice(0, 6);
    } else if (code.length < 6) {
      return code.padEnd(6, 'A');
    }
    return code;
  }

  encryptId(id: number): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv,
    );
    const idString = id.toString();
    let encrypted = cipher.update(idString);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decryptId(encryptedId: string): number {
    const textParts = encryptedId.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return parseInt(decrypted.toString());
  }

  async generateCode(userExist: Credenciales) {
    let verificationCode: string = this.generateVerificationCode();
    let expTIME = new Date(Date.now() + 1000 * 120).toISOString();

    //fehca y Hora de incio del dia
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    //Verificar si ya existen al menos 3 codigos de verificacion para el usuario
    const codes = await this.codigoVerificacionRepository.find({
      where: {
        userdId: userExist.id,
        exp: {
          between: [startDate.toISOString(), endDate.toISOString()],
        },
      },
    });

    //console.log('codes: ', codes);

    if (codes.length >= 3) {
      return {operation: false, content: 'limit'};
    }

    const bodyCode: VerifyCodeInfo = {
      userId: Number(userExist.id),
      codigo: verificationCode,
      exp: expTIME,
    };

    await this.codigoVerificacionRepository.create(bodyCode);

    return {
      operation: true,
      content: bodyCode,
    };
  }
}
