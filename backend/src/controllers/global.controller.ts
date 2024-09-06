// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get, param, response} from '@loopback/rest';
import {JWTService} from '../services';

// import {inject} from '@loopback/core';

export class GlobalController {
  constructor(
    @service(JWTService)
    private jwtService: JWTService,
  ) {}

  @get('/convert-id/{id}')
  @response(200, {
    description: 'UsuarioCliente model count',
    content: {
      'application/json': {
        schema: {
          type: 'number',
        },
      },
    },
  })
  async getId(@param.path.string('id') id: string): Promise<number> {
    const decoded = await this.jwtService.decryptId(id);
    return decoded;
  }
}
