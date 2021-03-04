import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteModel } from './cliente-model';
import { Contacto } from './contacto';
import { Modelo } from '../models/sexo';
import { ClienteService } from './usuario-clinico.service';
import { Message } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AppBreadcrumbService } from '../app.breadcrumb.service';

@Component({
    selector: 'crud-clientes',
    templateUrl: './crud-usuario-clinico.component.html'
})
export class CRUDClientesComponent implements OnInit {

    msgs: Message[] = [];
    colsContactos: any[];
    clienteModel: ClienteModel = new ClienteModel();
    cliente: Cliente= new Cliente();
    estadocivil: Modelo[];
    selectedContacto: Contacto;
    sexos: Modelo[];
    religiones: Modelo[];
    selectedGruSan: any;
    gruposanguineo: Modelo[];
    selectedEstCiv: any;
    selectedSexo: any;
    sino: any[];
    selectedSiNo: any;
    rubeola: string;
    fechaNa: Date;
    errores: string[];

    constructor(private breadcrumbService: AppBreadcrumbService,
        private clienteService: ClienteService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute) {

        this.breadcrumbService.setItems([
            { label: 'Administrar Pacientes', routerLink: ['/administrar-pacientes'] }
        ]);
        this.clienteModel = new ClienteModel();
        this.cargarPaciente();
    }

    ngOnInit() {
        this.selectedContacto = new Contacto();

        this.estadocivil = [
            { name: 'Soltero', code: 's' },
            { name: 'Casado', code: 'c' },
            { name: 'Divorciado', code: 'd' },
            { name: 'Viudo', code: 'v' },
            { name: 'Union Libre', code: 'ul' }
        ];
        this.colsContactos = [
            { field: 'nombre', header: 'Nombre' },
            { field: 'parentesco', header: 'Parentesco' },
            { field: 'email', header: 'Email' },
            { field: 'telefono', header: 'Teléfono' },
            { field: 'fechaIn', header: 'Fecha Ingreso' }
        ];
        this.sexos = [
            { name: 'Masculino', code: 'm' },
            { name: 'Femenino', code: 'f' }
        ];
        this.sino = [
            { name: 'Si', code: '1' },
            { name: 'No', code: '0' }
        ];
        this.religiones = [
            { name: 'Católico', code: 'c' },
            { name: 'Evangelico', code: 'e' },
            { name: 'Testigo de Jeova', code: 'tj' },
            { name: 'Musulman', code: 'm' },
            { name: 'Judío', code: 'j' }
        ];
        this.gruposanguineo = [
            { name: 'A+', code: 'a+' },
            { name: 'A-', code: 'a-' },
            { name: 'B+', code: 'b+' },
            { name: 'B-', code: 'b-' },
            { name: 'AB+', code: 'ab+' },
            { name: 'AB-', code: 'ab-' },
            { name: 'O+', code: 'o+' },
            { name: 'O-', code: 'o-' }
        ];
    }

    nuevoPaciente():void {
      this.router.navigate(['/nuevo-paciente']);
      this.clienteModel = new ClienteModel();
    }

    cargarPaciente(): void {
        this.activatedRoute.queryParams
            .subscribe(params => {
                console.log(params);
                let id = params.id;
                if (id) {
                    this.clienteService.getCliente(id).subscribe((cliente) => this.clienteModel = cliente);
                }
            });
    }
    selectContacto(c: Contacto): void {
        this.selectedContacto = c;
    }

    setPaciente() :void{
      this.cliente.contactos = this.clienteModel.contactos;
      this.cliente.direccion = this.clienteModel.direccion;
      this.cliente.email = this.clienteModel.email;
      this.cliente.enfermedades = this.clienteModel.enfermedades;
      this.cliente.estadoCivil = this.clienteModel.estadoCivil == undefined || this.clienteModel.estadoCivil.code == "" ? "" : this.clienteModel.estadoCivil.code;
      this.cliente.facturas = this.clienteModel.facturas;
      this.cliente.fechaIn = this.clienteModel.fechaIn;
      this.cliente.fechaNa = this.clienteModel.fechaNa;
      this.cliente.foto = this.clienteModel.foto;
      this.cliente.grupoSanguineo = this.clienteModel.grupoSanguineo == undefined || this.clienteModel.grupoSanguineo.code == "" ? "" : this.clienteModel.grupoSanguineo.code;;
      this.cliente.id = this.clienteModel.id;
      this.cliente.identificacion = this.clienteModel.identificacion;
      this.cliente.nombre = this.clienteModel.nombre;
      this.cliente.observacion = this.clienteModel.observacion;
      this.cliente.religion = this.clienteModel.religion == undefined || this.clienteModel.religion.code == "" ? "" : this.clienteModel.religion.code;;;
      this.cliente.sexo = this.clienteModel.sexo == undefined || this.clienteModel.sexo.code == "" ? "" : this.clienteModel.sexo.code;;;
      this.cliente.telefono = this.clienteModel.telefono;
    }

    create(): void {
      this.setPaciente();
      this.msgs = [];
        console.log(this.cliente);
            if (this.selectedContacto.nombre != undefined && this.selectedContacto.nombre != "" &&
                this.selectedContacto.parentesco != undefined && this.selectedContacto.parentesco != "" &&
                this.selectedContacto.email != undefined && this.selectedContacto.email != "" &&
                this.selectedContacto.telefono != undefined && this.selectedContacto.telefono != "") {
                  this.selectedContacto.fechaIn = new Date();
              this.cliente.contactos.push(this.selectedContacto);
              this.selectedContacto = new Contacto();
            }

            this.clienteService.create(this.cliente)
                .subscribe(
                    cliente => {
                        this.msgs.push({ severity: 'success', summary: 'Nuevo Paciente', detail: `El paciente ${cliente.nombre} ha sido creado con éxito` });
                        window.scroll(0, 0);
                    },
                    err => {
                        this.errores = err.error.errors as string[];
                        if (this.errores === undefined) {
                            this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string });
                        } else {
                            this.getErrores();
                        }
                        window.scroll(0, 0);
                        console.error('Código del error desde el backend: ' + err.status);
                        console.error(err.error.errors);
                    }
                );
                this.selectedContacto = new Contacto();
    }

    update(): void {
        this.setPaciente();
        console.log(this.cliente);
        if (this.selectedContacto.nombre != undefined && this.selectedContacto.nombre != "" &&
            this.selectedContacto.parentesco != undefined && this.selectedContacto.parentesco != "" &&
            this.selectedContacto.email != undefined && this.selectedContacto.email != "" &&
            this.selectedContacto.telefono != undefined && this.selectedContacto.telefono != "") {
              this.selectedContacto.fechaIn = new Date();
          this.cliente.contactos.push(this.selectedContacto);
          this.selectedContacto = new Contacto();
        }
        this.msgs = [];
        this.cliente.facturas = null;
        this.clienteService.update(this.cliente)
            .subscribe(
                json => {
                    this.msgs.push({ severity: 'success', summary: 'Paciente Actualizado', detail: `${json.mensaje}: ${json.cliente.nombre}` });
                    window.scroll(0, 0);
                },
                err => {
                    this.errores = err.error.errors as string[];
                    if (this.errores === undefined) {
                        this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string });
                    } else {
                        this.getErrores();
                    }
                    window.scroll(0, 0);
                    console.error('Código del error desde el backend: ' + err.status);
                    console.error(err.error.errors);
                }
            )
            this.selectedContacto = new Contacto();
    }

    guardarContacto(): void {
        this.msgs = [];
        if (this.clienteModel.id != null) {
            if (this.selectedContacto.id != null) {
                this.updateCantacto();
            } else {
                this.createContacto();
            }
            this.cargarPaciente();
            window.scroll(0, 0);
        } else {
            if (this.validateContacto() == 1) {
                this.selectedContacto.fechaIn = new Date();
                this.clienteModel.contactos.push(this.selectedContacto);
                this.selectedContacto = new Contacto();
            }
            window.scroll(0, 0);
        }
    }

    validateContacto(): number {
        let result = 1;
        if (this.selectedContacto.nombre == undefined || this.selectedContacto.nombre == "") {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: "Nombre del contacto es requerido" });
            result = 0;
        }

        if (this.selectedContacto.parentesco == undefined || this.selectedContacto.parentesco == "") {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: "Parentesco del contacto es requerido" });
            result = 0;
        }

        if (this.selectedContacto.telefono == undefined || this.selectedContacto.telefono == "") {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: "Telefono del contacto es requerido" });
            result = 0;
        }

        if (this.selectedContacto.email == undefined || this.selectedContacto.email == "") {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: "Email del contacto es requerido" });
            result = 0;
        }
        return result;
    }

    createContacto(): void {
        console.log(this.selectedContacto);
        this.clienteService.createContacto(this.selectedContacto, this.clienteModel.id)
            .subscribe(
                contacto => {
                    this.msgs.push({ severity: 'success', summary: 'Nuevo Contacto', detail: `El contacto ${contacto.nombre} ha sido creado con éxito` });
                    this.selectedContacto = new Contacto();
                },
                err => {
                    this.errores = err.error.errors as string[];
                    if (this.errores === undefined) {
                        this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string });
                    } else {
                        this.getErrores();
                    }
                    window.scroll(0, 0);
                    console.error('Código del error desde el backend: ' + err.status);
                    console.error(err.error.errors);
                }
            );
    }

    updateCantacto(): void {
        console.log(this.selectedContacto);
        this.msgs = [];
        this.clienteService.updateContacto(this.selectedContacto)
            .subscribe(
                json => {
                    this.msgs.push({ severity: 'success', summary: 'Contacto Actualizado', detail: `${json.mensaje}: ${json.contacto.nombre}` });
                    this.selectedContacto = new Contacto();
                },
                err => {
                    this.errores = err.error.errors as string[];
                    if (this.errores === undefined) {
                        this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string });
                    } else {
                        this.getErrores();
                    }
                    window.scroll(0, 0);
                    console.error('Código del error desde el backend: ' + err.status);
                    console.error(err.error.errors);
                }
            )
    }


    confirmBorrar(c: Contacto): void {
        this.confirmationService.confirm({
            message: 'Desea eliminar a ' + c.nombre + ' como contacto?',
            header: 'Confirmación Eliminar',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            icon: 'pi pi-info-circle',
            accept: () => {

                this.clienteService.deleteContacto(c.id).subscribe(
                    () => {
                        this.clienteModel.contactos = this.clienteModel.contactos.filter(cli => cli !== c)
                        this.msgs = [{ severity: 'success', summary: 'Contacto Eliminado', detail: 'Contacto ' + c.nombre + ' eliminado con éxito!' }];
                    }
                )
                window.scroll(0, 0);

            },
            reject: () => {
                this.selectedContacto = new Contacto();
            }
        });
    }

    limpiar(): void {
        this.msgs = [];
        this.clienteModel = new ClienteModel
        console.log(this.clienteModel);
    }

    getErrores(): void {
        this.msgs = [];
        if (this.errores != undefined) {
            for (let e of this.errores) {
                this.msgs.push({ severity: 'error', summary: 'Error', detail: e });
            }
        }
    }
}
