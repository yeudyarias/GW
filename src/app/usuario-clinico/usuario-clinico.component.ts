import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from './usuario-clinico.service';
import { BreadcrumbService } from '../breadcrumb.service';
import { ModalService } from './detalle/modal.service';
import { Message } from 'primeng/primeng';
import { AuthService } from '../usuarios/auth.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './usuario-clinico.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  cols: any[];
  selectedCliente: Cliente;
  paginador: any;
  displayDialog: boolean;
  nuevoCliente: boolean;
  msgs: Message[] = [];
  totalRecords: number;
  loading: boolean;


  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
     private authService: AuthService,
    private modalService: ModalService,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        { label: 'Lista Pacientes', routerLink: ['/lista-pacientes'] }
    ]);
  }

  ngOnInit() {
    this.cols = [
        { field: 'identificacion', header: 'Identificación' },
        { field: 'nombre', header: 'Nombre' },
        { field: 'email', header: 'Email' },
        { field: 'telefono', header: 'Teléfono' },
        { field: 'fechaNa', header: 'Fecha Nacimiento' }
    ];

    this.getClientes(0);

  this.modalService.notificarUpload.subscribe(cliente => {
    this.clientes = this.clientes.map(clienteOriginal => {
      if (cliente.id == clienteOriginal.id) {
        clienteOriginal.foto = cliente.foto;
      }
      return clienteOriginal;
    })
  })
  }

  nuevoPaciente():void {
    this.router.navigate(['/nuevo-paciente']);
  }


  private getClientes(page:number) {
    this.clienteService.getUsuariosClinico(page)
      .pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages*10;
      });
  }


  loadCarsLazyT(event: LazyLoadEvent) {
      this.loading = true;
      setTimeout(() => {
            this.getClientes(event.first/10);
            this.loading = false;

      }, 500);
  }

    onRowSelect(event) {
        this.router.navigate(['/administrar-pacientes'], {
          queryParams: { id: this.selectedCliente.id}});
    }
}
