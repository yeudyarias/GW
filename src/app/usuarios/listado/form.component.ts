import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private usuario: Usuario = new Usuario();
  titulo: string = "Crear Usuario";

  errores: string[];

  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if (id) {
        this.usuarioService.getUsuario(id).subscribe((usuario) => this.usuario = usuario);
      }
    });
  }

  create(): void {
    this.usuarioService.create(this.usuario)
      .subscribe(
        usuario => {
          this.router.navigate(['/usuarios']);
          //swal('Nuevo usuario', `El usuario ${usuario.nombre} ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  update(): void {
    this.usuarioService.update(this.usuario)
      .subscribe(
        json => {
          this.router.navigate(['/usuarios']);
          //swal('Usuario Actualizado', `${json.mensaje}: ${json.usuario.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

}
