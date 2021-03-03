import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { tap } from 'rxjs/operators';
import { Cargo } from 'src/app/models/cargo';
import { Message } from 'primeng/primeng';
import { ModalService } from 'src/app/usuario-clinico/detalle/modal.service';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { CargoService } from './cargo.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html'
})
export class CargoComponent implements OnInit {

  cargos: Cargo[];
  pp: Cargo[];
  cargoModel: Cargo = new Cargo();
  cargo: Cargo = new Cargo();  
  cols: any[];
  selectedCargo: Cargo;
  paginador: any;
  displayDialog: boolean;
  nuevoCliente: boolean;
  msgs: Message[] = [];
  totalRecords: number;
  loading: boolean;
  errores: string[];


  constructor(private cargoService: CargoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private modalService: ModalService,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Cargo', routerLink: ['/cargos'] }
    ]);
  }

  ngOnInit() {
    this.cols = [
      { field: 'idCargo', header: 'Id' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripcion' }
    ];

    this.getCargos(0);
    this.selectedCargo = new Cargo();

    this.modalService.notificarUpload.subscribe(cargo => {
      this.cargos = this.cargos.map(cargoOriginal => {
        return cargoOriginal;
      })
    })
  }

  private getCargos(page: number) {
    this.cargoService.getCargos(page)
      .pipe(
        tap(response => {
          console.log('CargosComponent: tap 3');
          (response.content as Cargo[]).forEach(cliente => console.log(cliente.nombre));
        })
      ).subscribe(response => {
        this.cargos = response.content as Cargo[];
        this.paginador = response;
        this.totalRecords = this.paginador.totalPages * 10;
      });
  }

  validarCargos(): any {
    var result = false;
    this.cargos.forEach(p => {
      if (p.nombre != null && this.selectedCargo.nombre && p.nombre.toUpperCase() == this.selectedCargo.nombre.toUpperCase()) {
          if (this.selectedCargo.idCargo != null && this.selectedCargo.idCargo != p.idCargo) {
            result = true;
          } else {
            result = true;
          }
      }
    });        
    return result;
  }


  guardarCargo(table): void {
    this.msgs = [];
    if (this.validarCargos()) {
      this.msgs.push({ severity: 'error', summary: 'Cargo Duplicado', detail: 'Cargo '+this.selectedCargo.nombre+' ya existe' });
      return;
    }
    if (this.selectedCargo.idCargo != null) {
      this.updateCargo();
    } else {
      this.createCargo();
    }
    this.selectedCargo = new Cargo();
    this.getCargos(0);
    this.limpiar();
    table.reset();
  }
  createCargo(): void {
    console.log(this.selectedCargo);
    this.cargoService.create(this.selectedCargo)
      .subscribe(
        cargo => {
          this.msgs.push({ severity: 'success', summary: 'Nuevo Cargo', detail: `El Cargo ${cargo.nombre} ha sido creado con éxito` });
          this.selectedCargo = new Cargo();
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

  updateCargo(): void {
    console.log(this.selectedCargo);
    this.msgs = [];
    this.cargoService.update(this.selectedCargo)
      .subscribe(
        json => {
          this.msgs.push({ severity: 'success', summary: 'Cargo Actualizado', detail: `El Cargo ${json.nombre} ha sido actualizado con éxito`  });
          this.selectedCargo = new Cargo();
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
      this.getCargos(event.first / 10);
      this.loading = false;

    }, 500);
  }

  onRowSelect(event) {

  }

  selectCargo(c: Cargo): void {
    this.selectedCargo = {...c};    
  }

  limpiar(): void {
    this.msgs = [];
    this.cargoModel = new Cargo
    console.log(this.cargoModel);
  }

  getErrores(): void {
    this.msgs = [];
    if (this.errores != undefined) {
      for (let e of this.errores) {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: e });
      }
    }
  }

  confirmBorrar(c: Cargo): void {
    this.confirmationService.confirm({
      message: 'Desea eliminar a ' + c.nombre + ' como cargo?',
      header: 'Confirmación Eliminar',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.cargoService.delete(c.idCargo).subscribe(
          () => {
            this.cargos = this.cargos.filter(cli => cli !== c)
            this.msgs = [{ severity: 'success', summary: 'Cargo Eliminado', detail: 'Cargo ' + c.nombre + ' eliminado con éxito!' }];
            this.getCargos(0);
          }
        )
        window.scroll(0, 0);

      },
      reject: () => {
        this.selectedCargo = new Cargo();
      }
    });
  }
}