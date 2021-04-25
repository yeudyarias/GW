import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import { Role } from './role';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;
  private urlEndPointUsuarios: string = 'http://localhost:8080/api/usuarios';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { }

  private agregarAuthorizationHeader() {
    let token = this.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = 'http://localhost:8080/oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.foto = payload.foto;
    if (payload.foto) {
      this._usuario.picByte = payload.picByte;
      this._usuario.fotoLista = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + payload.picByte);
    }    
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarUsuarioModificado(usuario: Usuario): void {
    let payload = this.obtenerDatosToken(this.token);
    this._usuario = new Usuario();
    this._usuario.nombre = usuario.nombre;
    this._usuario.apellido = usuario.apellido;
    this._usuario.email = usuario.email;
    this._usuario.username = usuario.username;
    this._usuario.foto = usuario.foto;    
    this._usuario.picByte = usuario.picByte;
    this._usuario.fotoLista = usuario.fotoLista;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  restablecerPassword(Usuario: Usuario): Observable<any> {
    return this.http.put<any>(`${this.urlEndPointUsuarios+'/update-password'}`, Usuario,{headers: this.agregarAuthorizationHeader()}).pipe(      
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        return throwError(e);
      }));
  }

  delete(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.urlEndPointUsuarios}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }


  hasRole(role: Role): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
   return false;
  }

  hasRoleUser(role: Role): boolean {
    for (let i =0; this.usuario.roles.length < i; i++ ) {
      if (this.usuario.roles[i].codigo == role.codigo) {
        return true;
      }
    }
   return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }


}
