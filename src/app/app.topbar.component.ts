import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GalleriaThumbnails } from 'primeng/galleria';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './usuarios/auth.service';
import { UsuarioService } from './usuarios/listado/usuario.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    fotoPerfil: any;
    fotoPerfil2: string;

    ngOnInit() {
        //this.usuarioService.notificarUpload.subscribe(imagen => {
          //  this.fotoPerfil = imagen;
          //}); 
    }

    constructor(public appMain: AppMainComponent, private authService: AuthService,
        private usuarioService: UsuarioService,
        private sanitizer: DomSanitizer, private router: Router) {
        if (this.authService.usuario.foto) {
            this.fotoPerfil = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/*;base64, ` + this.authService.usuario.picByte);            
        } else {
            this.fotoPerfil2 = "http://localhost:8080/api/uploads/img/" + authService.usuario.foto;
        }
    }


    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
