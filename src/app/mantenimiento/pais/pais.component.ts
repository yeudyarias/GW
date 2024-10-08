import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Pais } from 'src/app/models/pais';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { PaisService } from './pais.service';
import { ConfirmationService, LazyLoadEvent, Message, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';



@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  providers: [MessageService],
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {

  paises: Pais[];
  pp: Pais[];
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private modalService: ModalService,
    private breadcrumbService: AppBreadcrumbService) {
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

    //this.getPaises(0);
    this.selectedPais = new Pais();

    this.modalService.notificarUpload.subscribe(pais => {
      this.paises = this.paises.map(paisOriginal => {
        return paisOriginal;
      })
    })
  }

  private getPaises(page: number) {
    this.paisService.getPaises(page)
      .pipe(
        tap(response => {          
          (response.content as Pais[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.paises = response.content as Pais[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages * 10;
      });
  }

  validarPaises(): any {
    var result = false;
    if (this.paises != undefined && this.paises.length > 0) {
      this.paises.forEach(p => {
        if (p.nombre != null && this.selectedPais.nombre && p.nombre.toUpperCase() == this.selectedPais.nombre.toUpperCase()) {
          if (this.selectedPais.idPais != null && this.selectedPais.idPais != p.idPais) {
            result = true;
          } else {
            result = true;
          }
        }
      });
    }
    return result;
  }

  guardarPais(table): void {
    this.msgs = [];
    if (this.validarPaises()) {
      this.messageService.add({ severity: 'error', summary: 'Pais Duplicado', detail: 'Pais ' + this.selectedPais.nombre + ' ya existe' });
      return;
    }
    if (this.selectedPais.idPais != null) {
      this.updatePais();
    } else {
      this.createPais();
    }
    this.selectedPais = new Pais();
    this.getPaises(0);
    this.limpiar();
    table.reset();
  }
  createPais(): void {    
    this.paisService.create(this.selectedPais)
      .subscribe(
        pais => {
          this.msgs.push({ severity: 'success', summary: 'Nuevo Pais', detail: `El pais ${pais.nombre} ha sido creado con éxito` });
          this.selectedPais = new Pais();
        },
        err => {
          this.errores = err.error.errors as string[];
          if (this.errores === undefined) {
            this.msgs.push({ severity: 'error', summary: 'Error', detail: err.error.mensaje as string + "\n" });
          } else {
            this.getErrores();
          }
          window.scroll(0, 0);          
        }
      );
  }

  updatePais(): void {    
    this.msgs = [];
    this.paisService.update(this.selectedPais)
      .subscribe(
        json => {
          this.msgs.push({ severity: 'success', summary: 'Pais Actualizado', detail: `El pais ${json.nombre} ha sido actualizado con éxito` });
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

  selectPais(c: Pais): void {
    this.selectedPais = { ...c };
  }

  limpiar(): void {
    this.msgs = [];
    this.paisModel = new Pais
    this.selectedPais = new Pais();
  }

  getErrores(): void {
    this.msgs = [];
    if (this.errores != undefined) {
      for (let e of this.errores) {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: e });
      }
    }
  }

  confirmBorrar(c: Pais): void {
    this.confirmationService.confirm({
      message: 'Desea eliminar a ' + c.nombre + ' como pais?',
      header: 'Confirmación Eliminar',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.paisService.delete(c.idPais).subscribe(
          () => {
            this.paises = this.paises.filter(cli => cli !== c)
            this.msgs = [{ severity: 'success', summary: 'Pais Eliminado', detail: 'Pais ' + c.nombre + ' eliminado con éxito!' }];
            this.getPaises(0);
          }
        )
        window.scroll(0, 0);

      },
      reject: () => {
        this.selectedPais = new Pais();
      }
    });
  }
}

