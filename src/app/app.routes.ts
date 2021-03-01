import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { SampleDemoComponent } from './demo/view/sampledemo.component';
import { FormsDemoComponent } from './demo/view/formsdemo.component';
import { DataDemoComponent } from './demo/view/datademo.component';
import { PanelsDemoComponent } from './demo/view/panelsdemo.component';
import { OverlaysDemoComponent } from './demo/view/overlaysdemo.component';
import { MenusDemoComponent } from './demo/view/menusdemo.component';
import { MessagesDemoComponent } from './demo/view/messagesdemo.component';
import { ChartsDemoComponent } from './demo/view/chartsdemo.component';
import { FileDemoComponent } from './demo/view/filedemo.component';
import { MiscDemoComponent } from './demo/view/miscdemo.component';
import { EmptyDemoComponent } from './demo/view/emptydemo.component';
import { DocumentationComponent } from './demo/view/documentation.component';
import { ClientesComponent } from './usuario-clinico/usuario-clinico.component';
import { CRUDClientesComponent } from './usuario-clinico/crud-usuario-clinico.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { PaisComponent } from './mantenimiento/pais/pais.component';

export const routes: Routes = [
    { path: '', component: DashboardDemoComponent },
    { path: 'components/sample', component: SampleDemoComponent },
    { path: 'components/forms', component: FormsDemoComponent },
    { path: 'components/data', component: DataDemoComponent },
    { path: 'components/panels', component: PanelsDemoComponent },
    { path: 'components/overlays', component: OverlaysDemoComponent },
    { path: 'components/menus', component: MenusDemoComponent },
    { path: 'components/messages', component: MessagesDemoComponent },
    { path: 'components/misc', component: MiscDemoComponent },
    { path: 'pages/empty', component: EmptyDemoComponent },
    { path: 'components/charts', component: ChartsDemoComponent },
    { path: 'components/file', component: FileDemoComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'lista-pacientes', component: ClientesComponent },
    { path: 'administrar-pacientes', component: CRUDClientesComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'nuevo-paciente', component: CRUDClientesComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'login', component: LoginComponent },
    { path: 'paises', component: PaisComponent }
];

export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes,
  {onSameUrlNavigation: 'reload'}, 
);
