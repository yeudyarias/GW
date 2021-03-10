import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './usuarios/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    constructor(public appMain: AppMainComponent,private authService: AuthService, private router: Router) { }


    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
