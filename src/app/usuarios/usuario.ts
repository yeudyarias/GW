import { Empleado } from "../models/empleado";
import { Role } from "./role";

export class Usuario {
  idUsuario: number;
  username: string;
  password: string;
  enabled: boolean;    
  cambioPassword:number;  
  actualPassword:string;
  newPassword:string;
  confirmNewPassword:string;
  roles: Array<Role> = [];
  empleado:Empleado;
}
