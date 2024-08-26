import { Personas } from "./persona";
import { Usuario } from "./usuario";

export interface UsuarioCliente {
  id?: number;
  usuarioId: number;
  clienteId: number;
  Usuario?: Usuario;
  Cliente?: Personas
  [prop: string]: any;
}