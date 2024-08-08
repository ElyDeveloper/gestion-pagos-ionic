import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CredencialesRepository} from '../repositories/credenciales.repository';

export class UserService {
  @repository(CredencialesRepository)
  private credencialesRepository: CredencialesRepository
  constructor(
  ) { }

  async ExistUser(identificator: any) {
    if (!identificator)
      throw new HttpErrors[401]("No existe identificador");

    let user = await this.credencialesRepository.findOne({where: {email: identificator} || {username: identificator}});

    return user;
  }
}
