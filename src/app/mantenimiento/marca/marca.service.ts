import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Marca } from 'src/app/models/marca';


@Injectable()
export class MarcaService {
  private urlEndPoint: string = 'http://localhost:8080/marca/marcas';  

  constructor(private http: HttpClient, private router: Router) { }


  getUsuariosClinico(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('MarcaService: tap 1');
        (response.content as Marca[]).forEach(Marca => console.log(Marca.nombre));
      }),
      map((response: any) => {
        (response.content as Marca[]).map(Marca => {
          Marca.nombre = Marca.nombre.toUpperCase();
          return Marca;
        });
        return response;
      }),
      tap(response => {
        console.log('MarcaService: tap 2');
        (response.content as Marca[]).forEach(Marca => console.log(Marca.nombre));
      }));
  }

  getMarca(id): Observable<Marca> {
    return this.http.get<Marca>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/marcas']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  create(Marca: Marca): Observable<Marca> {
    return this.http.post(this.urlEndPoint, Marca)
      .pipe(
        map((response: any) => Marca as Marca),
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

  update(Marca: Marca): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${Marca.idMarca}`, Marca).pipe(
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

  delete(id: number): Observable<Marca> {
    return this.http.delete<Marca>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
}
