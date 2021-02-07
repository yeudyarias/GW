import { Contacto } from './contacto';
import { Modelo } from '../models/sexo';
import { Factura } from '../facturas/models/factura';

export class ClienteModel {
  id: number;
  identificacion:string;
  nombre: string;
  fechaNa:Date;
  sexo:Modelo;
  grupoSanguineo:Modelo;
  estadoCivil:Modelo;
  religion:Modelo;
  email: string;
  telefono:string;
  direccion:string;
  observacion:string;
  fechaIn:Date;
  foto: string;
  facturas: Array<Factura> = [];
  contactos: Array<Contacto> = [];
  enfermedades: Array<String> = [];

}
