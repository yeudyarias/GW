import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppComponent) { }

    ngOnInit() {
        this.model = [
            { label: 'Inicio', icon: 'fa fa-fw fa-dashboard', routerLink: ['/'] },
            {
                label: 'Pacientes', icon: 'fa fa-fw 	fa fa fa-vcard-o', routerLink: ['/components'],
                items: [
                    { label: 'Lista Pacientes', icon: 'fa fa-fw fa-group', routerLink: ['/lista-pacientes'] },
                    { label: 'Administrar Pacientes', icon: 'fa fa-fw 	fa fa fa-user-plus', routerLink: ['/nuevo-paciente'] }
                ]
            },
            {
                label: 'Mantenimiento', icon: 'fa fa-fw 	fa fa-cog', routerLink: ['/components'],
                items: [
                    { label: 'Paises', icon: 'fa fa-globe', routerLink: ['/paises'] },
                    { label: 'Marcas', icon: 'fa fa-car', routerLink: ['/marcas'] }, 
                    { label: 'Cargos', icon: 'fa fa-child', routerLink: ['/cargos'] },
                                       
                ]
            },
            {
                label: 'Administracion', icon: 'fa fa-fw fa-sitemap', routerLink: ['/components'],
                items: [
                    { label: 'Sample Page', icon: 'fa fa-fw fa-columns', routerLink: ['/components/sample'] },
                    { label: 'Forms', icon: 'fa fa-fw fa-code', routerLink: ['/components/forms'] },
                    { label: 'Data', icon: 'fa fa-fw fa-table', routerLink: ['/components/data'] },
                    { label: 'Panels', icon: 'fa fa-fw fa-list-alt', routerLink: ['/components/panels'] },
                    { label: 'Overlays', icon: 'fa fa-fw fa-square', routerLink: ['/components/overlays'] },
                    { label: 'Menus', icon: 'fa fa-fw fa-minus-square-o', routerLink: ['/components/menus'] },
                    { label: 'Messages', icon: 'fa fa-fw fa-circle-o-notch', routerLink: ['/components/messages'] },
                    { label: 'Charts', icon: 'fa fa-fw fa-area-chart', routerLink: ['/components/charts'] },
                    { label: 'File', icon: 'fa fa-fw fa-arrow-circle-o-up', routerLink: ['/components/file'] },
                    { label: 'Misc', icon: 'fa fa-fw fa-user-secret', routerLink: ['/components/misc'] }
                ]
            },
            {
                label: 'Pages', icon: 'fa fa-fw fa-life-saver', routerLink: ['/pages'],
                items: [
                    { label: 'Empty Page', icon: 'fa fa-fw fa-square-o', routerLink: ['/pages/empty'] },
                    { label: 'Landing Page', icon: 'fa fa-fw fa-globe', url: 'assets/pages/landing.html' },
                    { label: 'Login Page', icon: 'fa fa-fw fa-sign-in', url: 'assets/pages/login.html' },
                    { label: 'Error Page', icon: 'fa fa-fw fa-exclamation-circle', url: 'assets/pages/error.html' },
                    { label: '404 Page', icon: 'fa fa-fw fa-times', url: 'assets/pages/404.html' },
                    {
                        label: 'Access Denied Page', icon: 'fa fa-fw fa-exclamation-triangle',
                        url: 'assets/pages/access.html'
                    }
                ]
            },
            {
                label: 'Hierarchy', icon: 'fa fa-fw fa-gg',
                items: [
                    {
                        label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in' },
                                    { label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in' },
                                    { label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in' },
                                    { label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'fa fa-fw fa-sign-in',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'fa fa-fw fa-sign-in' },
                                    { label: 'Submenu 2.1.2', icon: 'fa fa-fw fa-sign-in' },
                                    { label: 'Submenu 2.1.3', icon: 'fa fa-fw fa-sign-in' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'fa fa-fw fa-sign-in' },
                                    { label: 'Submenu 2.2.2', icon: 'fa fa-fw fa-sign-in' }
                                ]
                            },
                        ]
                    }
                ]
            },
            { label: 'Docs', icon: 'fa fa-fw fa-book', routerLink: ['/documentation'] }
        ];
    }
}
