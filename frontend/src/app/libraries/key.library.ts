export namespace key {
  export const ONE_HOUR_SECONDS = 3600;
  export const MILLISECONDS = 1000;
  export const ONE_MINUTE_MILLISECONDS = 60000;
  export const TOKEN_EXPIRATION_TIME = (Date.now() / MILLISECONDS) + (ONE_HOUR_SECONDS * 3);
  export const TOKEN_KEY_NAME = 'token_session';
  export const CODE_VERIFICATION_EXPIRATION_TIME = (Date.now() / MILLISECONDS) + (ONE_MINUTE_MILLISECONDS * 3);
}