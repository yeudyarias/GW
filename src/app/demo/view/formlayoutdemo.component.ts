import {Component} from '@angular/core';
import { Pais } from 'src/app/models/pais';
import {AppBreadcrumbService} from '../../app.breadcrumb.service';

@Component({
    templateUrl: './formlayoutdemo.component.html'
})
export class FormLayoutDemoComponent {

    selectedState: Pais = null;

    states: Pais[] = [
        {nombre: 'Arizona', idPais: 1, descripcion:""},
        {nombre: 'California', idPais: 2, descripcion:""},
        {nombre: 'Florida', idPais: 3, descripcion:""},
        {nombre: 'Ohio', idPais: 4, descripcion:""},
        {nombre: 'Washington', idPais: 5, descripcion:""}
    ];

    cities1: any[] = [];

    cities2: any[] = [];

    city1: any = null;

    city2: any = null;

    constructor(private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
            {label: 'Form Layout'}
        ]);

       this.selectedState =  {nombre: 'Arizona', idPais: 1, descripcion:""};
    }
}
