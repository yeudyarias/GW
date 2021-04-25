import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Pais } from 'src/app/models/pais';
import { AuthService } from 'src/app/usuarios/auth.service';


@Injectable()
export class PaisService {
  private urlEndPoint: string = 'http://localhost:8080/pais/paises';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      this.authService.logout();
      this.router.navigate(['/login'])
      return true;
    }

    return false;
  }

  getPaises(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page,{headers: this.agregarAuthorizationHeader()}).pipe(
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
    return this.http.get<Pais>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/paises']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  create(Pais: Pais): Observable<Pais> {
    return this.http.post(this.urlEndPoint, Pais,{headers: this.agregarAuthorizationHeader()})
      .pipe(
        map((response: Pais) => Pais as Pais),
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
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
    return this.http.put<any>(`${this.urlEndPoint}/${Pais.idPais}`, Pais,{headers: this.agregarAuthorizationHeader()}).pipe(
      map((response: Pais) => Pais as Pais),
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
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
    return this.http.delete<Pais>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

}
