import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { Marca } from 'src/app/models/marca';
import { Message } from 'primeng/api';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { MarcaService } from './marca.service';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {

  marcas: Marca[];
  marcaModel: Marca = new Marca();
  marca: Marca = new Marca();
  cols: any[];
  selectedMarca: Marca;
  paginador: any;
  displayDialog: boolean;
  nuevoCliente: boolean;
  msgs: Message[] = [];
  totalRecords: number;
  loading: boolean;
  errores: string[];


  constructor(private marcaService: MarcaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalService: ModalService,
    private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Marcas', routerLink: ['/marcas'] }
    ]);
  }

  ngOnInit() {
    this.cols = [
      { field: 'idMarca', header: 'Id' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripcion' }
    ];

    this.getMarcas(0);
    this.selectedMarca = new Marca();

    this.modalService.notificarUpload.subscribe(marca => {
      this.marcas = this.marcas.map(marcaOriginal => {
        return marcaOriginal;
      })
    })
  }

  private getMarcas(page: number) {
    this.marcaService.getUsuariosClinico(page)
      .pipe(
        tap(response => {
          console.log('MarcasComponent: tap 3');
          (response.content as Marca[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.marcas = response.content as Marca[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages * 10;
      });
  }

  createMarca(): void {
    console.log(this.selectedMarca);
    this.marcaService.create(this.selectedMarca)
      .subscribe(
        contacto => {
          this.msgs.push({ severity: 'success', summary: 'Nuevo Contacto', detail: `El contacto ${contacto.nombre} ha sido creado con éxito` });
          this.selectedMarca = new Marca();
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

  guardarMarca(): void {
    if (this.selectedMarca.idMarca != null) {
      this.updateMarca();
    } else {
      this.createMarca();
    }
    this.selectedMarca = new Marca();
    this.getMarcas(0);

  }
  updateMarca(): void {
    console.log(this.selectedMarca);
    this.msgs = [];
    this.marcaService.update(this.selectedMarca)
      .subscribe(
        json => {
          this.msgs.push({ severity: 'success', summary: 'Marca Actualizada', detail: `${json.mensaje}: ${json.contacto.nombre}` });
          this.selectedMarca = new Marca();
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
      this.getMarcas(event.first / 10);
      this.loading = false;

    }, 500);
  }

  onRowSelect(event) {

  }
  limpiar(): void {
    this.msgs = [];
    this.marcaModel = new Marca
    console.log(this.marcaModel);
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

