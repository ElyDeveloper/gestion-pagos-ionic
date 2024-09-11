//Importar dotenv

require('dotenv').config();

export namespace keys {
  export const JWT_SECRET_KEY = 'jwtSecret@Key*2021';
  export const SECRET_KEY = 'keyAcces2024';
  export const ONE_HOUR_SECONDS = 3600000 * 99;
  export const MILLISECONDS = 1000;
  export const ONE_MINUTE_MILLISECONDS = 60000;
  export const TOKEN_EXPIRATION_TIME = Date.now() + ONE_HOUR_SECONDS * 3;
  export const SENDER_EMAIL = 'elydeveloperhn@gmail.com';
  export const SMTP_CLIENT = 'smtp.gmail.com';
  export const SMTP_PSWD = 'qxtf szbf iqse qrvs';
  export const SENDER_PHONE_NUMBER = '+50495206618';
  export const GENERATE_NEW_VERIFY_CODE = require('codeid');
  export const TIME_OUT_NAME = 'timeout_event';
  export const VERIFICATION_CODE_NAME = 'code';
  export const NAME_PROFILE_PHOTO = 'file';
  export const EXTENSIONS_IMAGE: string[] = ['.PNG', '.JPG', '.JPEG', '.SVG'];
  export const MAX_WIDTH_IMAGE = 1024 * 1024;
  // export const URL_FILE = 'C:\\Prestamos Files';
  export const URL_FILE = process.env.PATH_SAVE || 'C:\\Prestamos Files';
}
