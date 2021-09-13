import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { ConfirmationService, LazyLoadEvent, MessageService, Message, SelectItem } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { HttpEventType } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import { Empleado } from 'src/app/models/empleado';
import { Persona } from 'src/app/models/persona';
import { ExcelService } from 'src/app/services/excel.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { Role } from 'src/app/usuarios/role';
import { UsuarioService } from 'src/app/usuarios/listado/usuario.service';
import { PaisService } from 'src/app/mantenimiento/pais/pais.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Pais } from 'src/app/models/pais';
import { Cargo } from 'src/app/models/cargo';
import { CargoService } from 'src/app/mantenimiento/cargo/cargo.service';
import { Modelo } from 'src/app/models/modelo';
import { EmpleadoService } from './empleado.service';
import { DatePipe } from '@angular/common'



@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[];
  paises: Pais[];
  cargos: Cargo[];
  tiposSalario: SelectItem[];

  paginador: any;
  empleadoSeleccionado: Empleado;
  usuarioSeleccionado: Usuario;
  selectedEmpleado: Empleado;
  loading: boolean;
  totalRecords: number;
  usuarioDialog: boolean;
  empleadoDialog: boolean;
  submitted: boolean;
  errores: string[];
  private fotoSeleccionada: File;
  msgs: Message[] = [];
  msgs2: Message[] = [];
  progreso: number = 0;
  retrievedImage: any;
  roles: Role[];
  rolesSelected: Role[];
  selectedPais: Pais = null;
  password: boolean;
  oldPassword: boolean;
  newPassword: boolean;
  confirmNewPassword: boolean;

  constructor(private usuarioService: UsuarioService,
    private empleadoService: EmpleadoService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private breadcrumbService: AppBreadcrumbService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private paisService: PaisService,
    private cargoService: CargoService,
    public datepipe: DatePipe,
    private excelService: ExcelService) {

    this.breadcrumbService.setItems([
      { label: 'Administracion / Empleados', routerLink: ['/empleados'] }
    ]);

    this.roles = [
      { id: 2, nombre: 'Administrador', codigo: 'ROLE_ADMIN' },
      { id: 3, nombre: 'Supervisor', codigo: 'ROLE_SUPERVISOR' },
      { id: 1, nombre: 'Usuario', codigo: 'ROLE_USER' }
    ];
    this.tiposSalario = [
      { value: "1", label: 'Salario' },
      { value: "2", label: 'Hora' }
    ];
    this.getPaises();
    this.getCargos();
  }

  ngOnInit() {
    this.empleadoSeleccionado = new Empleado();
    this.empleadoSeleccionado.usuario = new Usuario();
    this.usuarioSeleccionado = new Usuario();
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.empleadoService.getEmpleados(page)
        .pipe(
          tap(response => {
            console.log('EmpleadoComponent: tap 3');
            (response.content as Empleado[]).forEach(empleado => console.log(empleado.persona.nombre));
          })
        ).subscribe(response => {
          this.empleados = response.content as Empleado[];
          this.paginador = response;
        });
    });
   
    this.oldPassword = false;
    this.confirmNewPassword = false;
    this.newPassword = false;
  }

  //***********************************************************************************
  //******************************  INICIO CARGAR LISTAS ******************************
  //***********************************************************************************

  /**
   * Obtener empleados
   * @param page 
   */
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

  /**
   * Obtener paises
   */
  getPaises() {
    this.paisService.getAllPaises()
      .pipe(
        tap(response => {
          (response as Pais[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.paises = response as Pais[];
      });
  }
  /**
   * Obtener Cargos
   */
  getCargos() {
    this.cargoService.getAllCargos()
      .pipe(
        tap(response => {
          (response as Pais[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.cargos = response as Cargo[];
      });
  }

  //***********************************************************************************
  //******************************  INICIO CARGAR LISTAS ******************************
  //***********************************************************************************

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



  openNewEmpleado() {
    this.limpiarMsj();
    this.empleadoSeleccionado = new Empleado();
    this.empleadoSeleccionado.usuario = new Usuario();
    this.empleadoSeleccionado.persona = new Persona();
    this.submitted = false;
    this.empleadoDialog = true;
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
    this.password = false;
    this.oldPassword = false;
  }


  editarUsuario(empleado: Empleado) {
    this.limpiarMsj();
    this.empleadoSeleccionado = { ...empleado };

    this.getUsuarioByIdEmpleado();
    
    if (this.empleadoSeleccionado.foto != null && this.empleadoSeleccionado.foto != undefined) {
      this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.empleadoSeleccionado.picByte);
    }
    this.usuarioDialog = true;
  }

  getUsuarioByIdEmpleado() {
    this.usuarioService.getUsuarioByIdEmpleado(this.empleadoSeleccionado.idEmpleado)
      .pipe(
        tap(response => {

        })
      ).subscribe(response => {
        this.usuarioSeleccionado = response as Usuario;
        this.rolesSelected = this.usuarioSeleccionado.roles;
      });
  }


  editarEmpleado(empleado: Empleado) {
    this.datepipe = new DatePipe('es-CR');
    empleado.fechaInicio = new Date(this.datepipe.transform(empleado.fechaInicio, 'MM/dd/yyyy'));
    empleado.fechaFin = new Date(this.datepipe.transform(empleado.fechaFin, 'MM/dd/yyyy'));
      
    this.limpiarMsj();
    this.empleadoSeleccionado = { ...empleado };
    this.empleadoDialog = true;
    this.selectedPais = this.empleadoSeleccionado.pais;
  }

  /*  eliminarUsuario(empleado: Empleado) {
     this.confirmationService.confirm({
       message: 'Esta seguro que desea deshabilitar el usuario ' + empleado.persona.nombre + '?',
       header: 'Confirmar',
       acceptLabel: 'Aceptar',
       rejectLabel: 'Cancelar',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
         this.usuarioService.delete(empleado.usuario.idUsuario).subscribe(
           () => {
             this.empleados = this.empleados.filter(cli => cli !== empleado);
             this.messageService.add({ severity: 'success', summary: 'Usuario Deshabilitado', detail: `Empleado  ${empleado.persona.nombre} deshabilitado`, life: 3000 });
           }
         )
       }
     });
   } */

  hideDialogEmpleado() {
    this.empleadoDialog = false;
    this.submitted = false;
  }

  hideDialogUsuario() {
    this.usuarioDialog = false;
    this.submitted = false;
  }

  salvarUsuario() {
    this.submitted = true;
    this.msgs = [];
    this.messageService.clear();
    this.usuarioSeleccionado.roles = this.rolesSelected;
    if (this.usuarioSeleccionado.username.trim() && this.usuarioSeleccionado.password.trim() && this.rolesSelected.length != 0) {
      if (this.usuarioSeleccionado.idUsuario) {
        if (this.usuarioSeleccionado.newPassword != this.usuarioSeleccionado.confirmNewPassword) {
          this.messageService.add({ severity: 'error', summary: 'Contraseñas invalidas ', detail: 'Las contrasenas no coinciden' });
          return;
        } else {
          this.updateUsuario();
        }

      }
      else {
        this.createUsuario();

      }
    }
  }


  salvarEmpleado() {
    this.submitted = true;
    this.msgs = [];
    this.messageService.clear();
    if (this.empleadoSeleccionado.persona.nombre.trim() && this.empleadoSeleccionado.persona.apellidos.trim() && this.empleadoSeleccionado.persona.email.trim()
      && this.empleadoSeleccionado.cargo.nombre && this.empleadoSeleccionado.pais.nombre && this.empleadoSeleccionado.tipoSalario
      && ((this.empleadoSeleccionado.tipoSalario == "1" && this.empleadoSeleccionado.salario >= 1) || (this.empleadoSeleccionado.tipoSalario == "2" && this.empleadoSeleccionado.montoHora >= 1))) {
      if (this.empleadoSeleccionado.idEmpleado) {
        this.updateEmpleado();
      }
      else {
        this.createEmpleado();

      }
    }
  }

  createUsuario(): void {
    this.usuarioService.create(this.usuarioSeleccionado)
      .subscribe(
        usuario => {
          this.messageService.add({ severity: 'success', summary: 'Usuario Guardado', detail: `El usuario ${this.usuarioSeleccionado.empleado.persona.nombre} ha sido creado con éxito`, life: 3000 });
          this.usuarioSeleccionado = new Usuario();
          this.getEmpleados(0);
          this.usuarioDialog = false;
        },
        err => {
          this.errores = err.error.errors as string[];
          console.log('Código del error desde el backend: ' + err.status);
          console.log(err.error.errors);
        }
      );
  }

  createEmpleado(): void {
    this.empleadoService.create(this.empleadoSeleccionado)
      .subscribe(
        usuario => {
          this.messageService.add({ severity: 'success', summary: 'Usuario Guardado', detail: `El Empleado ${this.empleadoSeleccionado.persona.nombre} ha sido creado con éxito`, life: 3000 });
          this.empleadoSeleccionado = new Empleado();
          this.getEmpleados(0);
          this.usuarioDialog = false;
        },
        err => {
          this.errores = err.error.errors as string[];
          console.log('Código del error desde el backend: ' + err.status);
          console.log(err.error.errors);
        }
      );
  }

  updateUsuario(): void {
    this.msgs = [];
    this.messageService.clear();
    this.usuarioService.update(this.usuarioSeleccionado)
      .subscribe(
        json => {
          this.messageService.add({ key: 'modal-message', severity: 'success', summary: 'Usuario Actualizado', detail: `El usuario ${this.usuarioSeleccionado.empleado.persona.nombre} ha sido actualizado con éxito`, life: 3000 });
          this.getEmpleados(0);
        },
        err => {
          this.messageService.add({ key: 'modal-message', severity: 'error', summary: 'Error', detail: err.error.mensaje as string, life: 3000 });
        }
      )
  }


  updateEmpleado(): void {
    this.msgs = [];
    this.messageService.clear();
    this.empleadoService.update(this.empleadoSeleccionado)
      .subscribe(
        json => {
          this.messageService.add({ key: 'modal-message', severity: 'success', summary: 'Empleado Actualizado', detail: `El usuario ${this.empleadoSeleccionado.persona.nombre} ha sido actualizado con éxito`, life: 3000 });
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
    this.usuarioService.subirFoto(this.fotoSeleccionada, this.usuarioSeleccionado.idUsuario)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.usuarioSeleccionado = response.usuario as Usuario;
          /*  if (this.authService.usuario.username == this.empleadoSeleccionado.username) { 
             this.authService.guardarUsuarioModificado(this.empleadoSeleccionado);
           } */
          if (this.usuarioSeleccionado.empleado.foto != null && this.usuarioSeleccionado.empleado.foto != undefined) {
            this.retrievedImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.usuarioSeleccionado.empleado.picByte);
          }
          this.getEmpleados(0);
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

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.empleados, 'empleados');
  }


  onChangeTipoSalario(event) {
    console.log('event :' + event);
    console.log(event.value);
    if (event.value == "1") {
      this.empleadoSeleccionado.montoHora = 0;
    } else if (event.value == "2") {
      this.empleadoSeleccionado.salario = 0;
    }
  }

}
