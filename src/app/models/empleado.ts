import { Usuario } from "../usuarios/usuario";
import { Cargo } from "./cargo";
import { Documento } from "./documento";
import { Pais } from "./pais";
import { Persona } from "./persona";

export class Empleado {
  idEmpleado: number;
  cargo: Cargo;
  pais: Pais;
  fechaInicio:Date;
  fechaFin:Date;
  tipoSalario:string;
  salario:number;
  montoHora:number;
  estado:string;
  type: string;
  foto: string;
  picByte: string;
  fotoLista: any;  
  usuario: Usuario;
  persona:Persona;
  documentos: Documento[];
}