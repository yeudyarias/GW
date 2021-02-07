import { Contacto } from './contacto';
import { Factura } from '../facturas/models/factura';

export class Cliente {
  id: number;
  identificacion:string;
  nombre: string;
  fechaNa:Date;
  sexo:string;
  grupoSanguineo:string;
  estadoCivil:string;
  religion:string;
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
