import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Cargo } from 'src/app/models/cargo';
import { AuthService } from 'src/app/usuarios/auth.service';


@Injectable()
export class CargoService {
  private urlEndPoint: string = 'http://localhost:8080/cargo/cargos';  
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }
  
  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  getAllCargos(): Observable<any> {
    return this.http.get(this.urlEndPoint,{headers: this.agregarAuthorizationHeader()}).pipe(
      tap((response: any) => {
        console.log('CargoService: tap 1');
        (response as Cargo[]).forEach(Pais => console.log(Pais.nombre));
      }),
      map((response: any) => {
        (response as Cargo[]).map(Pais => {
          Pais.nombre = Pais.nombre;
          return Pais;
        });
        return response;
      }),
      tap(response => {
        console.log('CargoService: tap 2');
        (response as Cargo[]).forEach(Pais => console.log(Pais.nombre));
      }));
  }


  getCargos(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('CargoService: tap 1');
        (response.content as Cargo[]).forEach(Cargo => console.log(Cargo.nombre));
      }),
      map((response: any) => {
        (response.content as Cargo[]).map(Cargo => {
            Cargo.nombre = Cargo.nombre.toUpperCase();
          return Cargo;
        });
        return response;
      }),
      tap(response => {
        console.log('CargoService: tap 2');
        (response.content as Cargo[]).forEach(Cargo => console.log(Cargo.nombre));
      }));
  }

  getCargo(id): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/cargos']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  create(Cargo: Cargo): Observable<Cargo> {
    return this.http.post(this.urlEndPoint, Cargo)
      .pipe(
        map((response: Cargo) => Cargo as Cargo),
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

  update(Cargo: Cargo): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${Cargo.idCargo}`, Cargo).pipe(
      map((response: Cargo) => Cargo as Cargo),
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

  delete(id: number): Observable<Cargo> {
    return this.http.delete<Cargo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
  
}
