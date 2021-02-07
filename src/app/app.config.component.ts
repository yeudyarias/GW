import {Component, OnInit} from '@angular/core';
import { AppComponent } from './app.component';

@Component({
    selector: 'app-config',
    template: `
        <div class="layout-config" [ngClass]="{'layout-config-active': app.configActive}" (click)="app.onConfigClick($event)">
            <div class="layout-config-content">
                <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
                    <i class="fa fa-cog"></i>
                </a>
                <a style="cursor: pointer" class="layout-config-close" (click)="onConfigCloseClick($event)">
                    <i class="fa fa-times"></i>
                </a>
                <p-tabView>
                    <p-tabPanel header="Light or Dark">
                        <div class="panel-items">
                            <div class="panel-item">
                                <a style="cursor: pointer" (click)="app.changeDarkOrLight(true)">
                                    <img src="assets/layout/images/configurator/menu/apollo-dark.png" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="app.darkTheme"></i>
                                </a>
                            </div>
                            <div class="panel-item">
                                <a style="cursor: pointer" (click)="app.changeDarkOrLight(false)">
                                    <img src="assets/layout/images/configurator/menu/apollo-static.png" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="!app.darkTheme"></i>
                                </a>
                            </div>
                        </div>
                    </p-tabPanel>
                    <p-tabPanel header="Menu">
                        <h1>Menu Modes</h1>
                        <div class="panel-items">
                            <div class="panel-item">
                                <a style="cursor: pointer" (click)="app.menuMode = 'static'">
                                    <img src="assets/layout/images/configurator/menu/apollo-static.png" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="app.menuMode === 'static'"></i>
                                </a>
                                <span>Static</span>
                            </div>
                            <div class="panel-item">
                                <a style="cursor: pointer" (click)="app.menuMode = 'overlay'">
                                    <img src="assets/layout/images/configurator/menu/apollo-overlay.png" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="app.menuMode === 'overlay'"></i>
                                </a>
                                <span>Overlay</span>
                            </div>
                            <div class="panel-item">
                                <a style="cursor: pointer" (click)="app.menuMode = 'horizontal'">
                                    <img src="assets/layout/images/configurator/menu/apollo-horizontal.png" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="app.menuMode === 'horizontal'"></i>
                                </a>
                                <span>Horizontal</span>
                            </div>
                            <div class="panel-item">
                                <a style="cursor: pointer" (click)="app.menuMode = 'slim'">
                                    <img src="assets/layout/images/configurator/menu/apollo-slim.png" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="app.menuMode === 'slim'"></i>
                                </a>
                                <span>Slim</span>
                            </div>
                        </div>
                    </p-tabPanel>
                    <p-tabPanel header="Themes">
                        <div class="panel-items">
                            <div class="panel-item" *ngFor="let theme of themes">
                                <a style="cursor: pointer" class="layout-config-layout-option" (click)="app.changeTheme(theme.label)">
                                    <img src="assets/layout/images/configurator/themes/{{theme.label}}.svg" alt="apollo"/>
                                    <i class="fa fa-check" *ngIf="app.selectedColor === theme.label"></i>
                                </a>
                            </div>
                        </div>
                    </p-tabPanel>
                </p-tabView>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit {

    themes: any[];

    lightThemes: any[];

    constructor(public app: AppComponent) {}

    ngOnInit() {
        this.themes = [
            {label: 'blue'},
            {label: 'green'},
            {label: 'cyan'},
            {label: 'purple'},
            {label: 'indigo'},
            {label: 'yellow'},
            {label: 'orange'},
            {label: 'pink'}
        ];
    }

    onConfigButtonClick(event) {
        this.app.configActive = !this.app.configActive;
        event.preventDefault();
    }

    onConfigCloseClick(event) {
        this.app.configActive = false;
        event.preventDefault();
    }
}
