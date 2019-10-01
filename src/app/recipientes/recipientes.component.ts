import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { RecipienteComponent } from '../recipiente/recipiente.component'
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipientes',
  templateUrl: './recipientes.component.html',
  styleUrls: ['./recipientes.component.css']
})
export class RecipientesComponent implements OnInit {

  @ViewChild("txtBuscar", { static: true }) miEemento: ElementRef;

  isHandset: boolean = false;
  totalRegistros: string = ""
  registros: any = [];
  arrFiltrado: any = [];
  verTotal: boolean = true;
  suscribir: Subscription;
  hayFiltro = false;
  textoBuscar: string = "";
  actualizarTT: string = "Actualizar el catálogo"
  buscarTT: string = "Filtrar elementos en el catálogo"
  verBuscar: boolean = false;

  constructor( private rutaActiva: ActivatedRoute,
    private servicio: ServicioService,
    public dialog: MatDialog,
    private route: Router) 
    { 
      if (this.servicio.rUsuario().rol==0)
      {
        this.route.navigateByUrl('/home');
      }
      
        this.servicio.actualizarCh.subscribe((accion: boolean)=>{
          this.llenarRegistros();
          }
        );
        this.servicio.teclaBuscar.subscribe((accion: boolean)=>{
          this.buscar();
          }
        );
        
        setTimeout(() => {
          this.llenarRegistros();
        }, 300);
      
    }

  ngOnInit() {
    
  }

  filtrar()
  {
    this.registros = this.aplicarFiltro(this.textoBuscar);
    this.hayFiltro = this.registros.length != this.arrFiltrado.length
    let cadAdicional: string = (this.hayFiltro ? " (de un total de " + this.arrFiltrado.length + ") " : "");
    this.totalRegistros = 'Hay ' + (this.registros.length == 1 ? 'una alerta' : this.registros.length + ' alertas') + ' en la lista' + cadAdicional;  
  }

  aplicarFiltro(cadena: string) {
    if (!cadena ) 
    {
      return this.arrFiltrado;
    }
    else 
    {
      return this.arrFiltrado.filter(datos => 
          datos.id.toLowerCase().indexOf(cadena.toLowerCase()) !== -1
          ||
          datos.nombre.toLowerCase().indexOf(cadena.toLowerCase()) !== -1
          ||
          datos.userm.toLowerCase().indexOf(cadena.toLowerCase()) !== -1
          ||
          datos.fecham.toLowerCase().indexOf(cadena.toLowerCase()) !== -1
          ||
          datos.miestatus.toLowerCase().indexOf(cadena.toLowerCase()) !== -1
      )
    }
  }

  ngOnDestroy()
  {
    if (this.suscribir)
    {
      this.suscribir.unsubscribe();
    }
  }

  llenarRegistros()
  {
    this.verBuscar = false;
    this.servicio.activarSpinner.emit(true);   
    this.registros = [];
    this.arrFiltrado = [];
    let consulta = "SELECT IF(a.estatus = 'A', 'activo', 'inactivo') as miestatus, a.id, IFNULL(a.nombre, '') as nombre, IFNULL(a.modificacion, 'N/A') AS fecham, IFNULL(b.nombre, '') AS userm FROM vw_alertas AS a LEFT JOIN cat_usuarios AS b ON a.modificado = b.id ORDER BY a.nombre";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      if (datos)
      {
        this.arrFiltrado = datos;
        this.registros = datos;
        let cadAdicional: string = (this.hayFiltro ? " Filtrado" : "");
        setTimeout(() => {
          this.totalRegistros = 'Hay ' + (this.registros.length == 1 ? 'una alerta' : this.registros.length + ' alertas') + ' en la lista';  
            this.servicio.activarSpinner.emit(false);   
        }, 500);
      }
    })
    
  }

  buscar()
  {
    this.verBuscar = !this.verBuscar
    if (this.buscar)
    {
      setTimeout(() => {
        this.miEemento.nativeElement.focus();
      }, 50);
    }
  }

  escapar()
{
  this.buscar()
}
  
  nuevo()
  {
    const dialogRef = this.dialog.open(RecipienteComponent, {
      width: '620px', height: '550px', data: { id: 0, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        //Se cancela la llamada
      }
    });
  }

  accion(indice: number)
  {
    const dialogRef = this.dialog.open(RecipienteComponent, {
      width: '620px', height: '550px', data: { id: this.registros[indice].id, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        //Se cancela la llamada
      }
    });
  }

  actualizar()
  {
    this.llenarRegistros();
  }

}


