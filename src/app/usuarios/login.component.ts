import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {Message, MessageService} from 'primeng//api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Sign In!';
  usuario: Usuario;
  msgs: Message[] = [];

  constructor(private authService: AuthService, private router: Router,private service: MessageService) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.msgs = [];
      this.msgs.push({severity:'info', summary:'Login', detail:`Hola ${this.authService.usuario.username} ya estás autenticado!`});
      this.router.navigate(['/lista-pacientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      this.msgs = [];
      this.service.add({severity:'error', summary:'Error Login', detail:'Usuario o Contraseña vacías!'});
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/lista-pacientes']);
      this.msgs = [];
      this.msgs.push({severity:'succes', summary:'Login', detail:`Hola ${usuario.username}, has iniciado sesión con éxito!`});
    }, err => {
      if (err.status == 400) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Error Login', detail:'Usuario o Contraseña incorrectas!'});
      }
      if (err.status == 0) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Error Login', detail:'Servidor se encuentra detenido'});
      }
    }
    );
  }

}
