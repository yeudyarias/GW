import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Message } from 'primeng/primeng';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

msgs: Message[] = [];

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let role = next.data['role'] as string;
    console.log(role);
    if (this.authService.hasRole(role)) {
      return true;
    }
    this.msgs = [];
    this.msgs.push({severity:'warning', summary:'Acceso denegado', detail:`Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`});

    this.router.navigate(['/lista-pacientes']);
    return false;
  }
}
