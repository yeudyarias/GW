import { EventEmitter, Injectable } from '@angular/core';
//import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { Usuario } from '../usuario';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class UsuarioService {
  private urlEndPoint: string = 'http://localhost:8080/api/usuarios';
  private _notificarUpload = new EventEmitter<any>();


  constructor(private http: HttpClient, private router: Router, 
    private sanitizer: DomSanitizer,
    private messageService: MessageService) { }

    get notificarUpload(): EventEmitter<any> {
      return this._notificarUpload;
    }
  

  getUsuarios(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('UsuarioService: tap 1');
        (response.content as Usuario[]).forEach(usuario => console.log(usuario.nombre));
      }),
      map((response: any) => {
        (response.content as Usuario[]).map(usuario => {
          usuario.nombre = usuario.nombre.toUpperCase();
          
            if (usuario.foto) {
              usuario.fotoLista = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + usuario.picByte);              
            }
          
          return usuario;
        });
        return response;
      }),
      tap(response => {
        console.log('UsuarioService: tap 2');
        (response.content as Usuario[]).forEach(usuario => console.log(usuario.nombre));
      })
    );
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post(this.urlEndPoint, usuario)
      .pipe(
        map((response: any) => response.usuario as Usuario),
        catchError(e => {

          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {          
            console.error(e.error.mensaje);
          }          
          return throwError(e);
        })
      );
  }

  getUsuario(id): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {        
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/paises']);
          console.error(e.error.mensaje);
        }
        
        return throwError(e);
      })
    );
  }

  update(usuario: Usuario): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${usuario.id}`, usuario).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {          
          console.error(e.error.mensaje);
        }         
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          this.messageService.add({ severity: 'error', summary: 'Deshabilitar Usuario', detail: e.error.mensaje, life: 3000 });
          if (e.error.mensaje) {          
            console.error(e.error.mensaje);
          }    
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {      
      reportProgress: true
    });

    return this.http.request(req);

  }
}
