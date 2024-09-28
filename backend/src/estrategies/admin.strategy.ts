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


export class AdministradorStrategy implements AuthenticationStrategy {
  name: string = 'admin';

  constructor(
    @service(EstrategyService)
    public strategyService: EstrategyService,
    @service(JWTService)
    private jwtService: JWTService
  ) {

  }
  async authenticate(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<UserProfile | RedirectRoute | undefined> {
    const token = parseBearerToken(request);
    //console.log(" token desde admin ", token)

    if (!token) {
      throw new HttpErrors[401]("No existe un token en la solicitud.")
    }

    const decodedToken = await this.jwtService.VerifyToken(token);
    const profileData = await this.strategyService.autheticate(decodedToken, Rol.Administrator);

    return profileData;
  }
}
