import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService, Message, SelectItem } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { HttpEventType } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { Empleado } from 'src/app/models/empleado';
import { AuthService } from 'src/app/usuarios/auth.service';
import { EmpleadoService } from './empleado.service';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';



@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[];

  paginador: any;
  empleadoSeleccionado: Empleado;
  selectedEmpleado: Empleado;
  loading: boolean;
  totalRecords: number;
  empleadoDialog: boolean;
  submitted: boolean;
  errores: string[];
  private fotoSeleccionada: File;
  msgs: Message[] = [];
  msgs2: Message[] = [];
  progreso: number = 0;
  retrievedImage: any;

  constructor(private empleadoService: EmpleadoService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private breadcrumbService: AppBreadcrumbService,
    private sanitizer: DomSanitizer,
    private authService: AuthService) {

    this.breadcrumbService.setItems([
      { label: 'Administracion / Empleados', routerLink: ['/empleados'] }
    ]);
  }

  ngOnInit() {
    this.empleadoSeleccionado = new Empleado();
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.empleadoService.getEmpleados(page)
        .pipe(
          tap(response => {
            console.log('EmpleadosComponent: tap 3');
            (response.content as Empleado[]).forEach(empleado => console.log(empleado.persona.nombre));
          })
        ).subscribe(response => {
          this.empleados = response.content as Empleado[];
          this.paginador = response;
        });
    });
  }

  abrirModal(empleado: Empleado) {
    this.empleadoSeleccionado = empleado;
    this.modalService.abrirModal();
  }

  loadCarsLazyT(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.getEmpleados(event.first / 10);
      this.loading = false;

    }, 500);
  }

  private getEmpleados(page: number) {
    this.empleadoService.getEmpleados(page)
      .pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Empleado[]).forEach(empleado => console.log(empleado.persona.nombre));
        })
      ).subscribe(response => {
        this.empleados = response.content as Empleado[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages * 10;
      });
  }

  openNew() {
    this.limpiarMsj();
    this.empleadoSeleccionado = new Empleado();
    this.submitted = false;
    this.empleadoDialog = true;
  }

  limpiarMsj() {
    this.msgs = [];
    this.msgs2 = [];
    this.messageService.clear();
  }


  editarEmpleado(empleado: Empleado) {
    this.limpiarMsj();
    this.empleadoSeleccionado = { ...empleado };

    if (this.empleadoSeleccionado.foto != null && this.empleadoSeleccionado.foto != undefined) {
      this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.empleadoSeleccionado.picByte);
    }
    this.empleadoDialog = true;
  }

  eliminarEmpleado(empleado: Empleado) {
    this.confirmationService.confirm({
      message: 'Esta seguro que desea deshabilitar el empleado ' + empleado.persona.nombre + '?',
      header: 'Confirmar',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.empleadoService.delete(empleado.idEmpleado).subscribe(
          () => {
            this.empleados = this.empleados.filter(cli => cli !== empleado);
            this.messageService.add({ severity: 'success', summary: 'Empleado Deshabilitado', detail: `Empleado  ${empleado.persona.nombre} deshabilitado`, life: 3000 });
          }
        )
      }
    });
  }

  hideDialog() {
    this.empleadoDialog = false;
    this.submitted = false;
  }

  salvarEmpleado() {
    this.submitted = true;
    this.msgs = [];
    this.messageService.clear();
    if (this.empleadoSeleccionado.persona.nombre.trim() && this.empleadoSeleccionado.persona.apellidos.trim() && this.empleadoSeleccionado.persona.email.trim()) {
      if (this.empleadoSeleccionado.idEmpleado) {
        this.update();
      }
      else {
        this.create();

      }
    }
  }

  create(): void {
    this.empleadoService.create(this.empleadoSeleccionado)
      .subscribe(
        empleado => {
          this.messageService.add({ severity: 'success', summary: 'Empleado Guardado', detail: `El empleado ${this.empleadoSeleccionado.persona.nombre} ha sido creado con éxito`, life: 3000 });
          this.empleadoSeleccionado = new Empleado();
          this.getEmpleados(0);
          this.empleadoDialog = false;
        },
        err => {
          this.errores = err.error.errors as string[];
          console.log('Código del error desde el backend: ' + err.status);
          console.log(err.error.errors);
        }
      );
  }

  update(): void {
    this.msgs = [];
    this.messageService.clear();
    this.empleadoService.update(this.empleadoSeleccionado)
      .subscribe(
        json => {
          this.messageService.add({ key: 'modal-message', severity: 'success', summary: 'Empleado Actualizado', detail: `El empleado ${this.empleadoSeleccionado.persona.nombre} ha sido actualizado con éxito`, life: 3000 });
          this.getEmpleados(0);
        },
        err => {
          this.messageService.add({ key: 'modal-message', severity: 'error', summary: 'Error', detail: err.error.mensaje as string, life: 3000 });
        }
      )
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.empleados.length; i++) {
      if (this.empleados[i].idEmpleado === id) {
        index = i
        break;
      }
    }

    return index;
  }


  seleccionarFoto(event) {
    this.msgs2 = [];
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      this.msgs2.push({ severity: 'error', summary: 'Imagen Invalida', detail: 'El archivo debe ser del tipo imagen' });
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(event) {
    this.fotoSeleccionada = event.files[0];
    this.empleadoService.subirFoto(this.fotoSeleccionada, this.empleadoSeleccionado.idEmpleado)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.empleadoSeleccionado = response.empleado as Empleado;
          /*  if (this.authService.empleado.username == this.empleadoSeleccionado.username) { 
             this.authService.guardarEmpleadoModificado(this.empleadoSeleccionado);
           } */
          if (this.empleadoSeleccionado.foto != null && this.empleadoSeleccionado.foto != undefined) {
            this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.empleadoSeleccionado.picByte);
          }
          this.getEmpleados(0);
          this.empleadoService.notificarUpload.emit(this.retrievedImage);
        }
      });
  }

  cerrarModalSubirFoto() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
