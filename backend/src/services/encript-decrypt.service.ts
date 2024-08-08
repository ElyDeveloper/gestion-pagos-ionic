import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
const CryptoJS = require('crypto-js');

@injectable({scope: BindingScope.TRANSIENT})
export class EncriptDecryptService {
  constructor() { }
  Encrypt(password: string) {
    let encryptNumber = 0;
    while (encryptNumber < 10) {
      password = CryptoJS.MD5(password).toString();
      encryptNumber++;
    }
    return password;
  }
}
