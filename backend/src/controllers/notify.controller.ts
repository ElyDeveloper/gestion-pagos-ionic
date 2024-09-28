import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {CodigoVerificacionRepository} from '../repositories/codigo-verificacion.repository';
import {CredencialesRepository} from '../repositories/credenciales.repository';
import {JWTService} from '../services';
import {NotifyService} from '../services/notify.service';
import {UsuarioRepository} from '../repositories/usuario.repository';
var shortid = require('shortid-36');

export class NotifyController {
  constructor(
    @service()
    private notify: NotifyService,
    @service(JWTService)
    private jwt: JWTService,
    @repository(CredencialesRepository)
    private credentialsRepository: CredencialesRepository,
    @repository(CodigoVerificacionRepository)
    private codigoVerificacionRepository: CodigoVerificacionRepository,
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
  ) {}

  @post('/send-email')
  async ParamtersTable(
    @requestBody()
    identi: {
      identificator: string;
      subject: string;
      text: string;
      atachment?: any;
      option: number;
    },
  ): Promise<any> {
    let userExist;

    if (identi.option == 1) {
      const userByEmail = await this.credentialsRepository.findOne({
        where: {correo: identi.identificator},
      });

      if (!userByEmail) {
        const userByUsername = await this.credentialsRepository.findOne({
          where: {username: identi.identificator},
        });

        if (!userByUsername) {
          return {error: 'Usuario no registrado'};
        }
        userExist = userByUsername;
      } else {
        userExist = userByEmail;
      }

      //Genera el codigo de verificacion y envia el correo electronico
      const {operation, content} = await this.jwt.generateCode(userExist);

      let rolId: any = await this.usuarioRepository.findOne({
        where: {correo: userExist.correo},
      });

      if (rolId) {
        const rolUsuario = rolId.rolid;
        // //console.log('RolUsuario: ', rolUsuario);
        if (rolUsuario == 1 || rolUsuario == 2) {
          //console.log('Código de verificación enviado: ', content);
          if (operation == true) {
            if (typeof content === 'string') {
              return {error: 'Error al enviar el correo'};
            }
            const result = await this.notify.EmailNotification(
              userExist.correo ?? '',
              'Código de verificación',
              `Su código de verificación es: ${content.codigo}`,
            );
            //console.log('Resultado de envío de correo: ', result);
            if (result) {
              return {
                message: 'Código de verificación enviado',
                expiration: content.exp,
              };
            }
            return {error: 'Error al enviar el correo'};
          } else {
            return {
              error:
                'Llego al limite de intentos diarios, espere 24 horas, o contacte al administrador.',
            };
          }
        } else {
          return {error: 'Usuario no autorizado'};
        }
      } else {
        return {error: 'Usuario no registrado'};
      }
    }

    if (identi.option == 2) {
      await this.notify.EmailNotification(
        identi.identificator,
        `${identi.subject}`,
        `${identi.text}`,
        identi.atachment,
      );
    }
    if (identi.option == 3) {
      await this.notify.EmailNotification(
        identi.identificator,
        `${identi.subject}`,
        `${identi.text}`,
      );
    }
    return true;
  }

  @post('/verify-code')
  async verifyCode(@requestBody() identi: {code: string}): Promise<any> {
    let CodeExist = await this.codigoVerificacionRepository.findOne({
      where: {codigo: identi.code},
    });

    if (!CodeExist) {
      return {error: 'Código no registrado'};
    }

    if (CodeExist.exp && Date.parse(CodeExist.exp) < Date.now()) {
      return {error: 'Código expirado'};
    }

    if (CodeExist.codigo != identi.code) {
      return {error: 'Código no coincide'};
    }

    return {
      userId: this.jwt.encryptId(CodeExist.userId ?? 0),
    };
  }
}
