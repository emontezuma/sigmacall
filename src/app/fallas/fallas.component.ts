import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { RecipienteComponent } from '../recipiente/recipiente.component'
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-fallas',
  templateUrl: './fallas.component.html',
  styleUrls: ['./fallas.component.css'],
  animations: [trigger('efecto', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)' })),
    state('out', style({ opacity: 0, transform: 'translateY(15px)' })),
    transition('in <=> out', [
      animate(600)
    ])
  ])]

})
export class FallasComponent implements OnInit {

  @ViewChild("txtBuscar", { static: true }) miEemento: ElementRef;

  isHandset: boolean = false;
  totalRegistros: string = ""
  registros = [];
  arrFiltrado: any = [];
  verTotal: boolean = true;
  suscribir: Subscription;
  hayFiltro = false;
  textoBuscar: string = "";
  actualizarTT: string = "Actualizar el catálogo"
  buscarTT: string = "Filtrar elementos en el catálogo"
  ayudaD: string = "Descargar las fallas del sistema"
  cambiarV: string = ""
  verBuscar: boolean = false;
  escaladas_color: string  = "tomato";
  escaladas_etiqueta: string  = ""; 
  escaladas_color_todo: string = "0px 0px 4px 4px #606060"
  vista_resumida_fallas: boolean = false;
  noHayReportado: boolean= false;


  constructor( private rutaActiva: ActivatedRoute,
    private servicio: ServicioService,
    public dialog: MatDialog,
    private route: Router) 
    {
      
     }

  ngOnInit() {
        this.servicio.actualizarCh.subscribe((accion: boolean)=>{
      this.llenarRegistros();
      }
    );
    this.servicio.teclaBuscar.subscribe((accion: boolean)=>{
      this.buscar();
      }
    );
    this.servicio.teclaCambiar.subscribe((accion: boolean)=>{
      this.cambiarVista();
      }
    );
    this.configuracion();
    setTimeout(() => {
      this.llenarRegistros();
    }, 300);
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

  configuracion()
  {
    //Validar si esta asignada
    let consulta = "SELECT * FROM sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this. servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        if (registro[0].id)
        {
          this.escaladas_color = registro[0].escaladas_color;
          this.escaladas_etiqueta = registro[0].escaladas_etiqueta;
          this.vista_resumida_fallas = this.servicio.rUsuario().vista_resumida_fallas;
          if (!this.vista_resumida_fallas)
          {
            this.vista_resumida_fallas = false; 
          }
          this.cambiarV = (this.vista_resumida_fallas ? "Vista resumen (F7)" : "Vista expandida (F7)" )
          if (!this.escaladas_color)
          {
            this.escaladas_color = "tomato"
          }
          this.escaladas_color_todo = "0px 0px 4px 4px " + this.escaladas_color
        }
      }
    })
  }


  llenarRegistros()
  {
    let consulta = "SELECT vw_alarmas.*, 'in' AS estado, IFNULL(vw_reportes.repeticiones, 0) AS repeticiones, IFNULL(vw_reportes.escalamientos, 0) AS escalamientos FROM sigma.vw_alarmas LEFT JOIN sigma.vw_reportes ON vw_alarmas.reporte = vw_reportes.id WHERE vw_alarmas.tiempo = 0 AND vw_alarmas.accion <> 9 ORDER BY vw_alarmas.inicio"
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      if (datos)
      {
        if (datos.length > 0)
        {
          //let arretmp = this.registros;
          //Se ordenan ambos arreglos de mayor a menor
          if (this.registros.length == 0)
          {
            datos.forEach((elemento, index) => {
              elemento.van = this.calcularTiempo(elemento.inicio)
            });
            this.registros = datos;
          }
          else
          {
              let arretmp2 = datos;
              let hallado = false;
              let hayEliminados = false;
              for (let i = 0; i < this.registros.length; i++)
              {
                  hallado = false;
                for (let j = 0; j < arretmp2.length; j++)
                  {
                      if (this.registros[i].id == arretmp2[j].id )
                      {
                        this.registros[i].escalamientos = arretmp2[j].escalamientos
                        this.registros[i].repeticiones = arretmp2[j].repeticiones
                        this.registros[i].van = this.calcularTiempo(this.registros[i].inicio)
                        hallado = true;
                        break;
                      }
                      
                  }   
                  if (!hallado)
                  {
                    hayEliminados = true;
                    this.registros[i].id = 0;
                  }
              }
              //Se quitan los eliminados
              if (hayEliminados)
              {
                for (let i = this.registros.length - 1; i>=0; i--)
                {
                  if (this.registros[i].id == 0)
                  {
                    this.registros[i].estado = "out";
                    
                  }
                }
                setTimeout(() => {
                  this.quitarCero()
                }, 600);
              }
              if (hayEliminados || (arretmp2.length != this.registros.length))
              {
                //Se agregan los nuevos
                for (let i = 0; i < arretmp2.length; i++)
                {
                  hallado = false;
                  for (let j = 0; j < this.registros.length; j++)
                    {
                        if (arretmp2[i].id == this.registros[j].id )
                        {
                          hallado = true;
                          break;
                        }
                        
                    }   
                    if (!hallado)
                    {
                      //this.registros.splice(i, 0, { id: arretmp2[i].id, falla: arretmp2[i].id, codigo: arretmp2[i].codigo, nombre: arretmp2[i].nombre, nave: arretmp2[i].nave, area: arretmp2[i].area, estacion: arretmp2[i].estacion, prioridad: arretmp2[i].prioridad, inicio: arretmp2[i].inicio, fin: arretmp2[i].fin, tiempo: arretmp2[i].tiempo, responsable: arretmp2[i].responsable, tecnologia: arretmp2[i].tecnologia, alerta: arretmp2[i].alerta, reporte: arretmp2[i].reporte, accion: arretmp2[i].accion, escalados: arretmp2[i].responsable, });
                      
                      this.registros.splice(i, 0, arretmp2[i]);
                      this.registros[i].van = this.calcularTiempo(this.registros[i].inicio)
                      this.registros[i].estado = "in";
                    }
                }
              }
              //datos.forEach((elemento, index) => {
                //elemento.van = this.calcularTiempo(elemento.inicio)
          //});
          //this.arrFiltrado = datos;
          //this.registros = datos;
            }
        }
        else if (this.registros.length > 0)
        {
          for (let j = 0; j < this.registros.length; j++)
          {
            this.registros[j].estado ="out";            
          }
          setTimeout(() => {
            this.registros = [];
          }, 300);
          
        }
        else if (!this.noHayReportado)
       {
        this.noHayReportado=true;
        let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class";
          mensajeCompleto.mensaje = "No se hallaron fallas abiertas";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
        setTimeout(() => {
          this.totalRegistros = (this.registros.length == 0 ? 'NO HAY FALLAS' : (this.registros.length == 1 ? 'Una falla' : this.registros.length + ' fallas')) + ' en la lista';  
            this.servicio.activarSpinner.emit(false);   
        }, 500);
        if (this.route.url == "/fallas")
        {
          setTimeout(() => {
            this.llenarRegistros();
          }, 1000);
        }
      }
    })
    
  }

  quitarCero()
  {
    for (let i = this.registros.length - 1; i>=0; i--)
    {
      if (this.registros[i].id == 0)
      {
        this.registros.splice(i, 1);  
      }
    }
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

cambiarVista()
{
  this.vista_resumida_fallas = !this.vista_resumida_fallas;
  this.cambiarV = (this.vista_resumida_fallas ? "Vista resumen (F7)" : "Vista expandida (F7)" )
  let consulta = "UPDATE sigma.cat_usuarios SET vista_resumida_fallas = '" + (this.vista_resumida_fallas ? "S" : "N") + "' WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 2000, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
    })
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

  calcularTiempo(inicio: any)
  {
    let fechaDesde = new Date();
    let fechaHasta = new Date(this.servicio.fecha(2, inicio, 'yyyy/MM/dd HH:mm:ss'));
    let  segundos =  fechaDesde.getTime() - fechaHasta.getTime() 
    segundos = segundos / 1000;
    segundos = Math.round(segundos);
    let horas = Math.floor(segundos / 3600);
    let minutos = Math.floor((segundos % 3600) / 60);
    segundos = segundos % 60 ; 
    let strminutos= '' +  minutos;
    let strsegundos= '' + segundos;
    if (minutos < 10) 
      { 
        strminutos = '0' + minutos;
      }
    if (segundos < 10) 
      { 
        strsegundos = '0' + segundos;
      } 
    return horas + ":" + strminutos + ":" + strsegundos;
    //return horas + ":" + strminutos;
  }

  actualizar()
  {
    this.llenarRegistros();
  }

  descargar()
  {

  }


  }


