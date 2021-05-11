import { EventEmitter, Injectable } from '@angular/core';
//import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { Empleado } from 'src/app/models/empleado';

@Injectable()
export class EmpleadoService {
  private urlEndPoint: string = 'http://localhost:8080/api/empleados';
  private _notificarUpload = new EventEmitter<any>();


  constructor(private http: HttpClient, private router: Router, 
    private sanitizer: DomSanitizer,
    private messageService: MessageService) { }

    get notificarUpload(): EventEmitter<any> {
      return this._notificarUpload;
    }
  

  getEmpleados(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('EmpleadoService: tap 1');
        (response.content as Empleado[]).forEach(empleado => console.log(empleado.persona.nombre));
      }),
      map((response: any) => {
        (response.content as Empleado[]).map(empleado => {
          empleado.persona.nombre = empleado.persona.nombre.toUpperCase();
          
            if (empleado.foto) {
              empleado.fotoLista = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + empleado.picByte);              
            }
          
          return empleado;
        });
        return response;
      }),
      tap(response => {
        console.log('EmpleadoService: tap 2');
        (response.content as Empleado[]).forEach(empleado => console.log(empleado.persona.nombre));
      })
    );
  }

  create(empleado: Empleado): Observable<Empleado> {
    return this.http.post(this.urlEndPoint, empleado)
      .pipe(
        map((response: any) => response.empleado as Empleado),
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

  getEmpleado(id): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {        
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/paises']);
          console.error(e.error.mensaje);
        }
        
        return throwError(e);
      })
    );
  }

  update(empleado: Empleado): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${empleado.idEmpleado}`, empleado).pipe(
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

  delete(id: number): Observable<Empleado> {
    return this.http.delete<Empleado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          this.messageService.add({ severity: 'error', summary: 'Deshabilitar Empleado', detail: e.error.mensaje, life: 3000 });
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
