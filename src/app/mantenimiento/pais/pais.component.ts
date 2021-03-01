import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { tap } from 'rxjs/operators';
import { Pais } from 'src/app/models/pais';
import { Message } from 'primeng/primeng';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { PaisService } from './pais.service';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {

  paises: Pais[];
  paisModel: Pais = new Pais();
  pais: Pais = new Pais();
  cols: any[];
  selectedPais: Pais;
  paginador: any;
  displayDialog: boolean;
  nuevoCliente: boolean;
  msgs: Message[] = [];
  totalRecords: number;
  loading: boolean;
  errores: string[];


  constructor(private paisService: PaisService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalService: ModalService,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Paises', routerLink: ['/paises'] }
    ]);
  }

  ngOnInit() {
    this.cols = [
      { field: 'idPais', header: 'Id' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripcion' }
    ];

    this.getPaises(0);
    this.selectedPais = new Pais();

    this.modalService.notificarUpload.subscribe(pais => {
      this.paises = this.paises.map(paisOriginal => {
        return paisOriginal;
      })
    })
  }

  private getPaises(page: number) {
    this.paisService.getUsuariosClinico(page)
      .pipe(
        tap(response => {
          console.log('PaisesComponent: tap 3');
          (response.content as Pais[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.paises = response.content as Pais[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages * 10;
      });
  }

  createPais(): void {
    console.log(this.selectedPais);
    this.paisService.create(this.selectedPais)
      .subscribe(
        contacto => {
          this.msgs.push({ severity: 'success', summary: 'Nuevo Contacto', detail: `El contacto ${contacto.nombre} ha sido creado con éxito` });
          this.selectedPais = new Pais();
        },
        err => {
          this.errores = err.error.errors as string[];
          if (this.errores === undefined) {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string });
          } else {
            this.getErrores();
          }
          window.scroll(0, 0);
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  guardarPais(): void {
    if (this.selectedPais.idPais != null) {
      this.updatePais();
    } else {
      this.createPais();
    }
    this.selectedPais = new Pais();
    this.getPaises(0);

  }
  updatePais(): void {
    console.log(this.selectedPais);
    this.msgs = [];
    this.paisService.update(this.selectedPais)
      .subscribe(
        json => {
          this.msgs.push({ severity: 'success', summary: 'Pais Actualizado', detail: `${json.mensaje}: ${json.contacto.nombre}` });
          this.selectedPais = new Pais();
        },
        err => {
          this.errores = err.error.errors as string[];
          if (this.errores === undefined) {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string });
          } else {
            this.getErrores();
          }
          window.scroll(0, 0);
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }


  loadCarsLazyT(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.getPaises(event.first / 10);
      this.loading = false;

    }, 500);
  }

  onRowSelect(event) {

  }
  limpiar(): void {
    this.msgs = [];
    this.paisModel = new Pais
    console.log(this.paisModel);
  }

  getErrores(): void {
    this.msgs = [];
    if (this.errores != undefined) {
      for (let e of this.errores) {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: e });
      }
    }
  }
}

