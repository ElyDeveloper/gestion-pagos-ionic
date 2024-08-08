import {errorIn} from "../interfaces/models/error.interface";
export namespace error {
  export const INVALID_EMAIL: errorIn = {id: -1, content: 'Correo invalido', solution: 'Utilice otro correo'};
  export const INVALID_USERNAME: errorIn = {id: -2, content: 'Nombre de usuario invalido', solution: 'Utilice otro nombre de usuario'};
  export const INVALID_PASSWORD: errorIn = {id: -3, content: 'Contraseña invalida', solution: 'Reestablezca su cotraseña'};
  export const INVALID_PHONENUMBER: errorIn = {id: -3, content: 'Numero de telefono invalido', solution: 'Utilice otro numero'};
  export const INVALID_PASSWORD_OR_EMAIL: errorIn = {id: -4, content: 'Correo o contraseña invalidos. ', solution: 'Pruebe otras credenciales'};
  export const CREDENTIALS_NOT_REGISTER: errorIn = {id: -5, content: 'Correo o contraseña invalidos. ', solution: 'Pruebe otras credenciales o cree una cuenta'};
  export const CREDENTIALS_ALREDY_EXIST: errorIn = {id: -6, content: 'Este correo o nombre de usuario no esta registrado.', solution: 'Utilice otras credenciales'};
  export const EMTY_CREDENTIALS: errorIn = {id: -7, content: 'Credenciales vacias.', solution: 'Rellene los campos necesarios'};
  export const INVALID_IMAGE_FORMAT: errorIn = {id: -8, content: 'Formato de imagen no permitido.', solution: 'Seleccione una imagen formato .PNG, .JPG, .JPEG, .SVG'};
  export const TOKEN_ALREADY_EXPIRED: errorIn = {id: -9, content: 'Sesion caducada.', solution: 'Inicie sesion nuevamente'};
  export const DISABLE_USER: errorIn = {id: -9, content: 'Este usuario de encuentra deshabilitado.', solution: 'Constacte a soporte tecnico'};
  export const First_Login_email: errorIn = {id: -10, content: 'No se pudo enviar el correo de Con las credenciales', solution: 'Constacte a soporte tecnico.'};


}
