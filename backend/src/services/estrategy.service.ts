import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security/dist';
import {token} from '../core/interfaces/models/token.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class EstrategyService {
  constructor(/* Add @inject to inject parameters */) { }

  autheticate = async (decodedToken: token, role: number) => {

    const {UserID, UserNAME, Role} = decodedToken.data;
    if (decodedToken.exp < Date.now()) {
      throw new HttpErrors[401]("Sesion expirada.")
    }
    if (decodedToken) {
      if (Role == role) {
        const profile: UserProfile = Object.assign({
          userid: UserID,
          username: UserNAME,
          role: Role,
        });

        return profile;
      } else {

        throw new HttpErrors[401](
          'El token es válido, pero no tiene los permisos suficientes para ejecutar esta acción.',
        );
      }
    } else {
      throw new HttpErrors[401]('El token enviado no es válido.');
    }
  }
}
