import { Clientes } from "./cliente";
import { Usuario } from "./usuario";

export interface UsuarioCliente {
  id?: number;
  usuarioId: number;
  clienteId: number;
  Usuario?: Usuario;
  Cliente?: Clientes;
  [prop: string]: any;
}