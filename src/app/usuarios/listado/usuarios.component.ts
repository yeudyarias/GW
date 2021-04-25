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
  oldPassword:boolean;
  newPassword:boolean;
  confirmNewPassword:boolean;
  
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
      { id: 2,nombre: 'Administrador', codigo: 'ROLE_ADMIN'},
      {id:3,nombre: 'Supervisor', codigo: 'ROLE_SUPERVISOR'},
      {id:1,nombre: 'Usuario', codigo: 'ROLE_USER'}
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
            (response.content as Usuario[]).forEach(usuario => console.log(usuario.nombre));
          })
        ).subscribe(response => {
          this.usuarios = response.content as Usuario[];
          this.paginador = response;
        });
    });    
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
          (response.content as Usuario[]).forEach(usuario => console.log(usuario.nombre));
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
  }


  editarUsuario(usuario: Usuario) {
    this.limpiarMsj();
    this.usuarioSeleccionado = { ...usuario };
    this.rolesSelected = this.usuarioSeleccionado.roles;
    if (this.usuarioSeleccionado.foto != null && this.usuarioSeleccionado.foto != undefined) {
      this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.usuarioSeleccionado.picByte);
    }
    this.usuarioDialog = true;
  }

  eliminarUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: 'Esta seguro que desea deshabilitar el usuario ' + usuario.nombre + '?',
      header: 'Confirmar',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.delete(usuario.id).subscribe(
          () => {
            this.usuarios = this.usuarios.filter(cli => cli !== usuario);
            this.messageService.add({ severity: 'success', summary: 'Usuario Deshabilitado', detail: `Usuario  ${usuario.nombre} deshabilitado`, life: 3000 });
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
    this.usuarioSeleccionado.roles = this.rolesSelected;
    if (this.usuarioSeleccionado.nombre.trim() && this.usuarioSeleccionado.apellido.trim() && this.usuarioSeleccionado.email.trim()) {
      if (this.usuarioSeleccionado.id) {
        this.update();
      }
      else {
        this.create();

      }
      this.usuarioDialog = false;
    }
  }

  create(): void {
    this.usuarioService.create(this.usuarioSeleccionado)
      .subscribe(
        usuario => {
          this.messageService.add({ severity: 'success', summary: 'Usuario Guardado', detail: `El usuario ${this.usuarioSeleccionado.nombre} ha sido creado con éxito`, life: 3000 });
          this.usuarioSeleccionado = new Usuario();
          this.getUsuarios(0);
        },
        err => {
          this.errores = err.error.errors as string[];
          console.log('Código del error desde el backend: ' + err.status);
          console.log(err.error.errors);
        }
      );
  }

  update(): void {
    this.usuarioService.update(this.usuarioSeleccionado)
      .subscribe(
        json => {
          this.messageService.add({ severity: 'success', summary: 'Usuario Actualizado', detail: `El usuario ${this.usuarioSeleccionado.nombre} ha sido actualizado con éxito`, life: 3000 });
          this.usuarioSeleccionado = new Usuario();
          this.getUsuarios(0);
        },
        err => {
          this.errores = err.error.errors as string[];          
        }
      )
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].id === id) {
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
    this.usuarioService.subirFoto(this.fotoSeleccionada, this.usuarioSeleccionado.id)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.usuarioSeleccionado = response.usuario as Usuario;
         /*  if (this.authService.usuario.username == this.usuarioSeleccionado.username) { 
            this.authService.guardarUsuarioModificado(this.usuarioSeleccionado);
          } */          
          if (this.usuarioSeleccionado.foto != null && this.usuarioSeleccionado.foto != undefined) {
            this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.usuarioSeleccionado.picByte);
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

  showOldPassword() {
    this.oldPassword = !this.oldPassword;
  }

  showNewPassword() {
    this.newPassword = !this.newPassword;
  }

  showNewConfirmPassword() {
    this.confirmNewPassword = !this.confirmNewPassword;
  }
}
