import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { tap } from 'rxjs/operators';
import { Marca } from 'src/app/models/marca';
import { Message } from 'primeng/primeng';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { MarcaService } from './marca.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {

  marcas: Marca[];
  pp: Marca[];
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
    private confirmationService: ConfirmationService,
    private modalService: ModalService,
    private breadcrumbService: BreadcrumbService) {
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
    this.marcaService.getMarcas(page)
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

  validarMarcas(): any {
    var result = false;
    this.marcas.forEach(p => {
      if (p.nombre != null && this.selectedMarca.nombre && p.nombre.toUpperCase() == this.selectedMarca.nombre.toUpperCase()) {
          if (this.selectedMarca.idMarca != null && this.selectedMarca.idMarca != p.idMarca) {
            result = true;
          } else {
            result = true;
          }
      }
    });        
    return result;
  }


  guardarMarca(table): void {
    this.msgs = [];
    if (this.validarMarcas()) {
      this.msgs.push({ severity: 'error', summary: 'Marca Duplicada', detail: 'Marca '+this.selectedMarca.nombre+' ya existe' });
      return;
    }
    if (this.selectedMarca.idMarca != null) {
      this.updateMarca();
    } else {
      this.createMarca();
    }
    this.selectedMarca = new Marca();
    this.getMarcas(0);
    this.limpiar();
    table.reset();
  }
  createMarca(): void {
    console.log(this.selectedMarca);
    this.marcaService.create(this.selectedMarca)
      .subscribe(
        marca => {
          this.msgs.push({ severity: 'success', summary: 'Nueva Marca', detail: `La marca ${marca.nombre} ha sido creada con éxito` });
          this.selectedMarca = new Marca();
        },
        err => {
          this.errores = err.error.errors as string[];
          if (this.errores === undefined) {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string +"\n"});
          } else {
            this.getErrores();
          }
          window.scroll(0, 0);
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  updateMarca(): void {
    console.log(this.selectedMarca);
    this.msgs = [];
    this.marcaService.update(this.selectedMarca)
      .subscribe(
        json => {
          this.msgs.push({ severity: 'success', summary: 'Marca Actualizada', detail: `La marca ${json.nombre} ha sido actualizada con éxito`  });
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

  selectMarca(c: Marca): void {
    this.selectedMarca = {...c};    
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

  confirmBorrar(c: Marca): void {
    this.confirmationService.confirm({
      message: 'Desea eliminar a ' + c.nombre + ' como marca?',
      header: 'Confirmación Eliminar',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.marcaService.delete(c.idMarca).subscribe(
          () => {
            this.marcas = this.marcas.filter(cli => cli !== c)
            this.msgs = [{ severity: 'success', summary: 'Marca Eliminada', detail: 'Marca ' + c.nombre + ' eliminada con éxito!' }];
            this.getMarcas(0);
          }
        )
        window.scroll(0, 0);

      },
      reject: () => {
        this.selectedMarca = new Marca();
      }
    });
  }
}

