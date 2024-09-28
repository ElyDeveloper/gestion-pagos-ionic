import {AuthenticationStrategy} from '@loopback/authentication/dist';
import {service} from '@loopback/core/dist';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security/dist';
import {ParamsDictionary} from 'express-serve-static-core';
import parseBearerToken from 'parse-bearer-token';
import {ParsedQs} from 'qs';
import {token} from '../core/interfaces/models/token.interface';
import {Rol} from '../core/library/rol.library';
import {EstrategyService, JWTService} from '../services';


export class ViewerStrategy implements AuthenticationStrategy {
  name: string = 'viewer';

  constructor(
    @service(EstrategyService)
    public strategyService: EstrategyService,
    @service(JWTService)
    private jwtService: JWTService
  ) {

  }
  async authenticate(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<UserProfile | RedirectRoute | undefined> {
    const token = parseBearerToken(request);
    //console.log(" token desde vv ", token)

    if (!token) {
      throw new HttpErrors[401]("No existe un token en la solicitud.")
    }
    const decodeToke = await this.jwtService.VerifyToken(token);
    const profileData = await this.strategyService.autheticate(decodeToke, Rol.Viewer);

    return profileData;
  }
}
