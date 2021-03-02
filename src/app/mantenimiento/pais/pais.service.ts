import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Pais } from 'src/app/models/pais';


@Injectable()
export class PaisService {
  private urlEndPoint: string = 'http://localhost:8080/pais/paises';  

  constructor(private http: HttpClient, private router: Router) { }


  getPaises(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('PaisService: tap 1');
        (response.content as Pais[]).forEach(Pais => console.log(Pais.nombre));
      }),
      map((response: any) => {
        (response.content as Pais[]).map(Pais => {
          Pais.nombre = Pais.nombre.toUpperCase();
          return Pais;
        });
        return response;
      }),
      tap(response => {
        console.log('PaisService: tap 2');
        (response.content as Pais[]).forEach(Pais => console.log(Pais.nombre));
      }));
  }

  getPais(id): Observable<Pais> {
    return this.http.get<Pais>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/paises']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  create(Pais: Pais): Observable<Pais> {
    return this.http.post(this.urlEndPoint, Pais)
      .pipe(
        map((response: Pais) => Pais as Pais),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  update(Pais: Pais): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${Pais.idPais}`, Pais).pipe(
      map((response: Pais) => Pais as Pais),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  delete(id: number): Observable<Pais> {
    return this.http.delete<Pais>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  
}
