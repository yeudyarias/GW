import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {AppMenuComponent} from './app.menu.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppConfigComponent} from './app.config.component';
import {AppFooterComponent} from './app.footer.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppBreadcrumbService} from './app.breadcrumb.service';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ProgressBarModule} from 'primeng/progressbar';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {TabViewModule} from 'primeng/tabview';
import {FormsModule} from '@angular/forms';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                ProgressBarModule,
                InputSwitchModule,
                FormsModule,
                ScrollPanelModule,
                TabViewModule
            ],
            declarations: [
                AppComponent,
                AppMenuComponent,
                AppConfigComponent,
                AppTopBarComponent,
                AppFooterComponent,
                AppBreadcrumbComponent
            ],
            providers: [AppBreadcrumbService]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
