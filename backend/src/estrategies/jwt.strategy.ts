import { AuthenticationStrategy } from "@loopback/authentication";
import { service } from "@loopback/core";
import { HttpErrors, Request } from "@loopback/rest";
import { UserProfile, securityId } from "@loopback/security";
import parseBearerToken from "parse-bearer-token";
import { EstrategyService, JWTService } from "../services";

export class MyAuthStrategyProvider implements AuthenticationStrategy {
  name: string = "jwt";

  constructor(
    @service(EstrategyService)
    public strategyService: EstrategyService,
    @service(JWTService)
    private jwtService: JWTService
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    //console.log("Tokennn", token);
    if (!token) {
      throw new HttpErrors.Unauthorized("No existe un token en la solicitud.");
    }

    const decodedToken = await this.jwtService.VerifyToken(token);
    //console.log("Token decodificado", decodedToken);
    const userProfile = await this.strategyService.autheticate(decodedToken);

    if (!userProfile) {
      throw new HttpErrors.Unauthorized("Usuario no autenticado");
    }

    return {
      [securityId]: userProfile.id || "",
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
    };
  }
}