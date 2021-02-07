import { Component, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { AuthService } from './usuarios/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    msgs: Message[] = [];

    constructor(public breadcrumbService: BreadcrumbService,private authService: AuthService, private router: Router) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    logout(): void {
      let username = this.authService.usuario.username;
      this.authService.logout();
      this.msgs = [];
      this.msgs.push({severity:'success', summary:'Logout', detail:`Hola ${username}, has cerrado sesión con éxito!`});
      this.router.navigate(['/login']);
    }
}
