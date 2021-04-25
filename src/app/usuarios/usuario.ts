import { Role } from "./role";

export class Usuario {
  id: number;
  username: string;
  password: string;
  enabled: boolean;
  nombre: string;
  apellido: string;
  email: string;  
  foto: string;
  type: string;
  picByte: string;
  fotoLista: any;
  roles: Array<Role> = [];
}
