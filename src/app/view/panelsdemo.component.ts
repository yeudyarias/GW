import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
    templateUrl: './panelsdemo.component.html',
    styles: [`
        :host ::ng-deep button {
            margin-right: .25em;
        }
    `]
})
export class PanelsDemoComponent implements OnInit {

    items: MenuItem[];

    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Components' },
            { label: 'Panels', routerLink: ['/components/panels'] }
        ]);
    }


    ngOnInit() {
        this.items = [
            { label: 'Angular.io', icon: 'fa fa-link', url: 'http://angular.io' },
            { label: 'Theming', icon: 'fa fa-book', routerLink: ['/theming'] }
        ];
    }
}
