export class AuthorizationError extends Error {
  constructor(message: string = 'No autorizado') {
    super(message);
    this.name = 'AuthorizationError';
  }
}