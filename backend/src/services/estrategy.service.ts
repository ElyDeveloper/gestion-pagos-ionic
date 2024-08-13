import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security/dist';
import {token} from '../core/interfaces/models/token.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class EstrategyService {
  constructor(/* Add @inject to inject parameters */) { }

  autheticate = async (decodedToken: UserProfile, role?: number) => {
    if(decodedToken){
      const profile: UserProfile = Object.assign({
        id: decodedToken.id,
        username: decodedToken.name,
        email: decodedToken.email,
      })
      return profile;
    }else{
      throw new HttpErrors[401]('El toje enviado no es valido');
    }
  
  }
}
