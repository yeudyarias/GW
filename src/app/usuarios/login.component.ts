import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng//api';
import { Role } from './role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Sign In!';
  usuario: Usuario;
  userRole: Role;
  userAdmin: Role;
  usuarioEmail: Usuario;
  msgs: Message[] = [];
  displayBasic: boolean;
  errores: string[];

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {
    this.usuario = new Usuario();
    this.userRole = new Role();
    this.userAdmin = new Role();
    this.userRole.codigo = "ROLE_USER";
    this.userAdmin.codigo = "ROLE_ADMIN";
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.msgs = [];
      this.msgs.push({ severity: 'info', summary: 'Login', detail: `Hola ${this.authService.usuario.username} ya estás autenticado!` });
      this.router.navigate(['/usuarios']);
    }
  }
  cerrar(): void {
    this.displayBasic = false;
    this.usuario.empleado.persona.email = "";
  }
  login(): void {    
    if (this.usuario.username == null || this.usuario.password == null) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Usuario o Contraseña vacías!' });
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.userRole = "ROLE_USER" as unknown as Role;
      if (this.authService.hasRole(this.userRole)) {
        this.router.navigate(['/paises']);
      } else if (true) {
        this.router.navigate(['/usuarios']);
      } else  {
        this.router.navigate(['/usuarios']);
      }
      
      this.msgs = [];
      this.msgs.push({ severity: 'info', summary: 'Login', detail: `Hola ${usuario.username}, has iniciado sesión con éxito!` });
    }, err => {
      if (err.status == 400) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Error', detail: 'Usuario o Contraseña incorrectas!' });
      }
      if (err.status == 401) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Error', detail: `Usuario ${this.usuario.username }, se encuentra deshabilitado!` });
      }
      if (err.status == 0) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error ', detail: 'Servidor se encuentra detenido' });
      }
    }
    );
  }
  enviar(): void {
    this.msgs = [];
    this.usuarioEmail = this.usuario;
    var msj = "";
    var seve= "";
    var summ= '';
    if (!this.validateEmail(this.usuarioEmail.empleado.persona.email)) {
      this.msgs.push({ severity: 'error', summary: 'Correo Invalido', detail: 'Correo electronico invalido'});
    } else {

      this.authService.restablecerPassword(this.usuarioEmail).subscribe(
          json => {            
            this.messageService.add({severity:'info', summary: 'Restablecer Contraseña', detail: json.mensaje});            
            this.usuario.empleado.persona.email = "";
          },
          err => {
            this.errores = err.error.errors as string[];
            if (this.errores === undefined) {
              this.msgs = [];
              this.msgs.push({severity:'error', summary: 'Error', detail: err.error.mensaje as string});                          
            } else {
              this.getErrores();
            }
            window.scroll(0, 0);
          }
        );
    }
    this.usuario = new Usuario();
    this.usuarioEmail = new Usuario();
    this.displayBasic = false;
  }
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  getErrores(): void {
    this.msgs = [];
    if (this.errores != undefined) {
      for (let e of this.errores) {
        this.msgs = [];
        this.messageService.add({severity:'error', summary: 'Error', detail: e});                          
        this.msgs.push({ severity: 'error', summary: 'Error', detail: e });
      }
    }
  }

}
