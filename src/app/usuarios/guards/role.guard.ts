import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router, private messageService: MessageService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let role = next.data['role'] as Role;
    console.log(role);
    if (this.authService.hasRole(role)) {
      return true;
    }
    this.messageService.add({severity:'warn', summary: 'Acceso Denegado', detail: `Hola ${this.authService.usuario.username} no tienes acceso a la pantalla de ` + state.url.toUpperCase().substring(1)});                
    return false;
  }
}
