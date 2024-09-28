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

  @get('/decrypted-id/{id}')
  @response(200, {
    description: 'Id Decrypted model count',
    content: {
      'application/json': {
        schema: {
          type: 'number',
        },
      },
    },
  })
  async getIdDecrypted(@param.path.string('id') id: string): Promise<number> {
    const decoded = await this.jwtService.decryptId(id);
    return decoded;
  }

  @get('/encrypted-id/{id}')
  @response(200, {
    description: 'Id Encrypted model',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async getIdEncrypted(@param.path.number('id') id: number): Promise<any> {
    //console.log('Id to encrypt:', id);
    const encoded = await this.jwtService.encryptId(id);
    //console.log('Id encrypted:', encoded);
    return {
      idEncrypted: encoded,
    };
  }
}
