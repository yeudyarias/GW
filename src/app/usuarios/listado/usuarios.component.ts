import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { Usuario } from '../usuario';
import { ConfirmationService, LazyLoadEvent, MessageService, Message, SelectItem } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { HttpEventType } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { AuthService } from '../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Role } from '../role';
import * as CryptoJS from 'crypto-js';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];

  paginador: any;
  usuarioSeleccionado: Usuario;
  selectedUsuario: Usuario;
  loading: boolean;
  totalRecords: number;
  usuarioDialog: boolean;
  submitted: boolean;
  errores: string[];
  private fotoSeleccionada: File;
  msgs: Message[] = [];
  msgs2: Message[] = [];
  progreso: number = 0;
  retrievedImage: any;
  roles: Role[];
  rolesSelected: Role[];
  password: boolean;
  oldPassword: boolean;
  newPassword: boolean;
  confirmNewPassword: boolean;

  constructor(private usuarioService: UsuarioService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private breadcrumbService: AppBreadcrumbService,
    private sanitizer: DomSanitizer,
    private authService: AuthService) {

    this.breadcrumbService.setItems([
      { label: 'Administracion / Usuarios', routerLink: ['/usuarios'] }
    ]);

    this.roles = [
      { id: 2, nombre: 'Administrador', codigo: 'ROLE_ADMIN' },
      { id: 3, nombre: 'Supervisor', codigo: 'ROLE_SUPERVISOR' },
      { id: 1, nombre: 'Usuario', codigo: 'ROLE_USER' }
    ];
  }

  ngOnInit() {
    this.usuarioSeleccionado = new Usuario();
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.usuarioService.getUsuarios(page)
        .pipe(
          tap(response => {
            console.log('UsuariosComponent: tap 3');
            (response.content as Usuario[]).forEach(usuario => console.log(usuario.empleado.persona.nombre));
          })
        ).subscribe(response => {
          this.usuarios = response.content as Usuario[];
          this.paginador = response;
        });
    });
    this.oldPassword = false;
    this.confirmNewPassword = false;
    this.newPassword = false;
  }

  abrirModal(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modalService.abrirModal();
  }

  loadCarsLazyT(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.getUsuarios(event.first / 10);
      this.loading = false;

    }, 500);
  }

  private getUsuarios(page: number) {
    this.usuarioService.getUsuarios(page)
      .pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Usuario[]).forEach(usuario => console.log(usuario.empleado.persona.nombre));
        })
      ).subscribe(response => {
        this.usuarios = response.content as Usuario[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages * 10;
      });
  }

  openNew() {
    this.limpiarMsj();
    this.usuarioSeleccionado = new Usuario();
    this.submitted = false;
    this.usuarioDialog = true;
  }

  limpiarMsj() {
    this.msgs = [];
    this.msgs2 = [];
    this.messageService.clear();    
    this.limpiarPasswords();
  }

  limpiarPasswords() {
    this.newPassword = false;
    this.confirmNewPassword = false;
    this.password =false;
    this.oldPassword = false;
  }


  editarUsuario(usuario: Usuario) {
    this.limpiarMsj();
    this.usuarioSeleccionado = { ...usuario };
    this.rolesSelected = this.usuarioSeleccionado.roles;
    if (this.usuarioSeleccionado.empleado.foto != null && this.usuarioSeleccionado.empleado.foto != undefined) {
      this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.usuarioSeleccionado.empleado.picByte);
    }
    this.usuarioDialog = true;
  }

  eliminarUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: 'Esta seguro que desea deshabilitar el usuario ' + usuario.empleado.persona.nombre + '?',
      header: 'Confirmar',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.delete(usuario.idUsuario).subscribe(
          () => {
            this.usuarios = this.usuarios.filter(cli => cli !== usuario);
            this.messageService.add({ severity: 'success', summary: 'Usuario Deshabilitado', detail: `Usuario  ${usuario.empleado.persona.nombre} deshabilitado`, life: 3000 });
          }
        )
      }
    });
  }

  hideDialog() {
    this.usuarioDialog = false;
    this.submitted = false;
  }

  salvarUsuario() {
    this.submitted = true;
    this.msgs = [];
    this.messageService.clear();
    this.usuarioSeleccionado.roles = this.rolesSelected;
    if (this.usuarioSeleccionado.empleado.persona.nombre.trim() && this.usuarioSeleccionado.empleado.persona.apellidos.trim() && this.usuarioSeleccionado.empleado.persona.email.trim()
      && this.usuarioSeleccionado.username.trim() && this.usuarioSeleccionado.password.trim() &&  this.rolesSelected.length != 0) {
      if (this.usuarioSeleccionado.idUsuario) {
        if (this.usuarioSeleccionado.newPassword != this.usuarioSeleccionado.confirmNewPassword) {
          this.messageService.add({ severity: 'error', summary: 'Contraseñas invalidas ', detail: 'Las contrasenas no coinciden' });
          return;
        } else {
          this.update();
        }

      }
      else {
        this.create();

      }      
    }
  }

  create(): void {
    this.usuarioService.create(this.usuarioSeleccionado)
      .subscribe(
        usuario => {
          this.messageService.add({ severity: 'success', summary: 'Usuario Guardado', detail: `El usuario ${this.usuarioSeleccionado.empleado.persona.nombre} ha sido creado con éxito`, life: 3000 });
          this.usuarioSeleccionado = new Usuario();
          this.getUsuarios(0);
          this.usuarioDialog = false;
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
    this.usuarioService.update(this.usuarioSeleccionado)
      .subscribe(
        json => {
          this.messageService.add({key:'modal-message',  severity: 'success', summary: 'Usuario Actualizado', detail: `El usuario ${this.usuarioSeleccionado.empleado.persona.nombre} ha sido actualizado con éxito`, life: 3000 });         
          this.getUsuarios(0);          
        },
        err => {          
          this.messageService.add({ key:'modal-message', severity: 'error', summary: 'Error', detail: err.error.mensaje as string, life: 3000 });          
        }
      )
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].idUsuario === id) {
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
    this.usuarioService.subirFoto(this.fotoSeleccionada, this.usuarioSeleccionado.idUsuario)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.usuarioSeleccionado = response.usuario as Usuario;
          /*  if (this.authService.usuario.username == this.usuarioSeleccionado.username) { 
             this.authService.guardarUsuarioModificado(this.usuarioSeleccionado);
           } */
          if (this.usuarioSeleccionado.empleado.foto != null && this.usuarioSeleccionado.empleado.foto != undefined) {
            this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.usuarioSeleccionado.empleado.picByte);
          }
          this.getUsuarios(0);
          this.usuarioService.notificarUpload.emit(this.retrievedImage);
        }
      });
  }

  cerrarModalSubirFoto() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
  showPassword() {
    this.password = !this.password;
    console.log("1: " + this.password.valueOf);
  }

  showOldPassword() {
    this.oldPassword = !this.oldPassword;
    console.log("1: " + this.oldPassword.valueOf);
  }

  showNewPassword() {
    this.newPassword = !this.newPassword;
    console.log("2: " + this.newPassword.valueOf);
  }

  showNewConfirmPassword() {
    this.confirmNewPassword = !this.confirmNewPassword;
    console.log("3: " + this.confirmNewPassword.valueOf);
  }

}
