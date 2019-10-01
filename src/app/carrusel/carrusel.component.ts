import { Component, OnInit, AfterContentInit, Inject, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { DxChartComponent } from "devextreme-angular";
import { GraficaParamComponent } from '../grafica-param/grafica-param.component';
import { GraficaFormatComponent } from '../grafica-format/grafica-format.component';
import { DatePipe } from '@angular/common'
import { createHostListener } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
  animations: [trigger('efecto', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)' })),
    state('out', style({ opacity: 0, transform: 'translateY(20px)', overflow: "hidden"  })),
    transition('in <=> out', [
      animate(1000)
    ])
  ])]

})

export class CarruselComponent implements OnInit {

  @ViewChild(DxChartComponent, { static: true }) chart: DxChartComponent;
  @ViewChild("txtBuscar", { static: true }) miEemento: ElementRef;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    
    this.calcularPantalla()    
  }

  state: string ="in";
  //URL_BASE = "http://localhost:8081/sigmacall/api/imagenes/";
  URL_BASE = "/sigmacall/api/imagenes/";
  animarGrafico: boolean = true;
  registros = [];
  noHayReportado: boolean= false;
  totalRegistros: string = ""
  segundosEspera: number = 0;
  ultimo: number = 0;
  vista_resumida_fallas: boolean = false;
  escaladas_color_todo: string = "";
  carrusel: number = 0;
  escape: number = 0;
  listaLlamadas = [];
  titulo_fuente: number = 10;
  titulo: string = "";
  orden: string = "";
  color_fondo: string = "";
  color_fondo_barras: string = "";
  color_leyenda: string = "";
  color_letras: string = "";
  sub_titulo_fuente: number = 10;
  sub_titulo: string = "";
  textoPeriodo: string = "";
  margen_arriba: number = 10;
  margen_abajo: number = 10;
  margen_izquierda: number = 10;
  margen_derecha: number = 10;
  etiqueta_fuente: string = "10";
  etiqueta_leyenda: string = "10";
  texto_x: string = "";
  texto_x_fuente: string = "";
  texto_y: string = "";
  texto_y_fuente: string = "";
  ancho: number = 0;
  alto: number = 0;
  maximo_barras: number = 6;
  maximo_barraspct: number = 6;
  agrupar: boolean = false;
  agrupar_alfinal: boolean = false;
  periodo_tipo: number = 0;
  periodo_atras: number = 1;
  mostrar_tabla: boolean = false;
  icono_filtrar: string = "filtrar";
  vistaGrafico: number = 1;
  maxmin: {};
  intervalo: number = 1;
  maxmin2: {};
  intervalo2: number = 1;literalGrafico: string = ""
  tituloGrafica: string = "";
  animando: boolean = false;
  bajo_hasta: number = 50;
  bajo_color: string = "tomato";
  bajo_etiqueta: string  = "Mal...";
  medio_hasta: number = 50;
  medio_color: string = "#F2A446";
  medio_etiqueta: string = "Regular";
  alto_color: string = "limegreen";
  alto_etiqueta: string = "A tiempo";
  escaladas_color: string = "#F2A446";
  escaladas_etiqueta: string = "Tardio";
  noatendio_color: string = "tomato";
  noatendio_etiqueta: string = "No atendida";
  verBuscar: boolean = true;
  nombreArchivo: string = "";
  bajo_color_todo: string = "0px 0px 4px 4px #606060"
  medio_color_todo: string = "0px 0px 4px 4px #606060"
  alto_color_todo: string = "0px 0px 4px 4px #606060"
  textoBuscar: string = "";
  anchoPG1: number = 600;
  altoPG1: number = 600;
  altoPG1IMG: number = 560;
  sideNav: boolean = true;
  altoGrafica: number = 200;
  anchoGrafica: number = 200;
  altoTabla: number = 300;
  verGrafico: boolean = false;
  cad_consolidado: string = "CONSOLIDADO";
  hayDatos: boolean = false;

  graficas_seleccion: string = "N;N;N;N;N;N";
  graficas_duracion: string = "30;30;30;30;30;30";
  ruta_imagenes: string = "";
  tiempo_imagen: number = 0;

  grafico01: boolean = false;
  grafico02: boolean = false;
  grafico03: boolean = false;
  grafico04: boolean = false;
  grafico05: boolean = false;
  grafico06: boolean = false;
  grafico07: boolean = false;
  grafico08: boolean = false;
  grafico09: boolean = false;
  grafico10: boolean = false;

  duracion01: number = 10;
  duracion02: number = 10;
  duracion03: number = 10;
  duracion04: number = 10;
  duracion05: number = 10;
  duracion06: number = 10;
  duracion07: number = 10;
  duracion08: number = 10;
  duracion09: number = 10;
  duracion10: number = 10;

  fallas: any[] = [];
  valoresBuscar: any[] = ['total', 'buenas', 'tarde', 'noatendio'];
  chart_visualRange = [0, 100];
  verRates: boolean = true;
  ayuda01: string = "Aplica un filtro a los datos de la gráfica";
  ayuda02: string = "Cambia el formato de la gráfica";
  ayuda03: string = "Exporta la gráfica y los datos que la conforman";

  columnasTabla = [];

  tImagenes: number = 0;
  aImagenes: number = 0;
  imagenes = [];  
  miImagen: string = "";  

  constructor(
    public datepipe: DatePipe,  
    private servicio: ServicioService,
    public dialog: MatDialog,
    private router: Router, 
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.servicio.refrescarGrafico.subscribe((accion: boolean) => {
      
      setTimeout(() => {
        this.calcularPantalla()    
      }, 300);

    }
    );
    this.servicio.refrescarVista.subscribe((accion: boolean) => {
      this.verGrafico = false;
      this.graficar()
    });
  }

  graficar() {
    let consulta = "SELECT * from sigma.pu_graficos WHERE grafico = " + this.vistaGrafico + " AND (usuario = 0 OR usuario = " + this.servicio.rUsuario().id + ") ORDER BY usuario DESC LIMIT 1";
    let campos = { accion: 100, consulta: consulta };
    this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
      if (registro && registro.length > 0) {
        this.titulo = registro[0].titulo;
        this.orden = registro[0].orden;

        if (registro[0].color_fondo)
        {
          this.color_fondo = registro[0].color_fondo;
          this.color_fondo = this.color_fondo.replace("HEX", "#");
        }
        else
        {
          this.color_fondo = "transparent";
        }

        if (registro[0].color_fondo_barras)
        {
          this.color_fondo_barras = registro[0].color_fondo_barras;
          this.color_fondo_barras = this.color_fondo_barras.replace("HEX", "#");
        }
        else
        {
          this.color_fondo_barras = "transparent";
        }
        
        if (registro[0].color_letras)
        {
          this.color_letras = registro[0].color_letras;
          this.color_letras = this.color_letras.replace("HEX", "#");
        }
        else
        {
          this.color_letras = "black";
        }

        if (registro[0].color_leyenda)
        {
          this.color_leyenda = registro[0].color_leyenda;
          this.color_leyenda = this.color_leyenda.replace("HEX", "#");
        }
        else
        {
          this.color_leyenda = "transparent";
        }

        this.orden = registro[0].orden;
        this.titulo_fuente = registro[0].titulo_fuente;
        //this.sub_titulo = registro[0].sub_titulo;
        this.sub_titulo = this.servicio.rEstacion();
        if (!this.sub_titulo)
        {
          this.sub_titulo = "TODAS LAS ESTACIONES"
        }
        this.sub_titulo_fuente = registro[0].sub_titulo_fuente;
        this.margen_arriba = registro[0].margen_arriba;
        this.margen_abajo = registro[0].margen_abajo;
        this.margen_izquierda = registro[0].margen_izquierda;
        this.margen_derecha = registro[0].margen_derecha;
        this.etiqueta_fuente = registro[0].etiqueta_fuente;
        this.etiqueta_leyenda = registro[0].etiqueta_leyenda;
        this.texto_x = registro[0].texto_x;
        this.texto_x_fuente = registro[0].texto_x_fuente;
        this.texto_y = registro[0].texto_y;
        this.texto_y_fuente = registro[0].texto_y_fuente;
        this.ancho = registro[0].ancho;
        this.alto = registro[0].alto;
        this.maximo_barras = registro[0].maximo_barras;
        this.maximo_barraspct = registro[0].maximo_barraspct;
        this.agrupar = registro[0].agrupar == "S";
        this.agrupar_alfinal = registro[0].agrupar_alfinal == "S";
        this.periodo_tipo = registro[0].periodo_tipo;
        this.periodo_atras = registro[0].periodo_atras;
        this.mostrar_tabla = registro[0].mostrar_tabla == "S";
        this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 * 0.6 : this.altoPG1);
        if (this.vistaGrafico==1)
        {
          this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 260 : this.altoPG1);
        }
        else
        {
          this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 290 : this.altoPG1);
        }

        
        this.anchoGrafica = this.anchoPG1 - 110;
        this.altoTabla = this.altoPG1 - this.altoGrafica
        this.servicio.aPeriodo(this.periodo_tipo);
        this.poblarGrafico();
      }
    })
  }

  ngOnInit() {
    this.servicio.teclaBuscar.subscribe((accion: boolean)=>{
      this.buscar();
      }
    );
    this.vista_resumida_fallas = this.servicio.rUsuario().vista_resumida_fallas;
      if (!this.vista_resumida_fallas)
      {
        this.vista_resumida_fallas = false; 
      }
    this.calcularPantalla()
    this.configuracion();
    
    
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
          this.color_fondo = registro[0].color_fondo;
          if (this.color_fondo)
          {
            this.color_fondo = this.color_fondo.replace("HEX", "#");
          }
          this.medio_color = registro[0].medio_color;
          if (this.medio_color)
          {
            this.medio_color = this.medio_color.replace("HEX", "#");
          }
          this.alto_color = registro[0].alto_color;
          if (this.alto_color)
          {
            this.alto_color = this.alto_color.replace("HEX", "#");
          }
          this.escaladas_color = registro[0].escaladas_color;
          if (this.escaladas_color)
          {
            this.escaladas_color = this.escaladas_color.replace("HEX", "#");
          }
          this.noatendio_color = registro[0].noatendio_color;
          if (this.noatendio_color)
          {
            this.noatendio_color = this.noatendio_color.replace("HEX", "#");
          }
          this.noatendio_etiqueta = registro[0].noatendio_etiqueta;
          this.escaladas_etiqueta = registro[0].escaladas_etiqueta;
          this.vista_resumida_fallas = this.servicio.rUsuario().vista_resumida_fallas;
          if (!this.vista_resumida_fallas)
          {
            this.vista_resumida_fallas = false; 
          }
          if (!this.escaladas_color)
          {
            this.escaladas_color = "tomato"
          }
          this.escaladas_color_todo = "0px 0px 4px 4px " + this.escaladas_color
          this.bajo_hasta = registro[0].bajo_hasta;
          this.bajo_etiqueta = registro[0].bajo_etiqueta;
          this.medio_hasta = registro[0].medio_hasta;
          this.medio_etiqueta = registro[0].medio_etiqueta;
          this.alto_etiqueta = registro[0].alto_etiqueta;
          this.escaladas_etiqueta = registro[0].escaladas_etiqueta;
          this.noatendio_etiqueta = registro[0].noatendio_etiqueta;
          this.bajo_color_todo = "0px 0px 4px 4px " + this.bajo_color
          this.medio_color_todo = "0px 0px 4px 4px " + this.medio_color
          this.alto_color_todo = "0px 0px 4px 4px " + this.alto_color
          this.cad_consolidado = registro[0].cad_consolidado
          this.graficas_seleccion = registro[0].graficas_seleccion
          this.graficas_duracion = registro[0].graficas_duracion
          
          if (this.graficas_seleccion)
          {
            let mGraficas = this.graficas_seleccion.split(";");
            this.grafico01 = (mGraficas[0]=="S" ? true : false);
            this.grafico02 = (mGraficas[1]=="S" ? true : false);
            this.grafico03 = (mGraficas[2]=="S" ? true : false);
            this.grafico04 = (mGraficas[3]=="S" ? true : false);
            this.grafico05 = (mGraficas[4]=="S" ? true : false);
            this.grafico06 = (mGraficas[5]=="S" ? true : false);
            this.grafico07 = (mGraficas[6]=="S" ? true : false);
            this.grafico08 = (mGraficas[7]=="S" ? true : false);
            this.grafico09 = (mGraficas[8]=="S" ? true : false);
            this.grafico10 = (mGraficas[9]=="S" ? true : false);
          }

          if (this.graficas_duracion)
          {
            let mGraficas = this.graficas_duracion.split(";");
            this.duracion01 = +mGraficas[0];
            this.duracion02 = +mGraficas[1];
            this.duracion03 = +mGraficas[2];
            this.duracion04 = +mGraficas[3];
            this.duracion05 = +mGraficas[4];
            this.duracion06 = +mGraficas[5];
            this.duracion07 = +mGraficas[6];
            this.duracion08 = +mGraficas[7];
            this.duracion09 = +mGraficas[8];
            this.duracion10 = +mGraficas[9];
          }

          this.ruta_imagenes = registro[0].ruta_imagenes;
          this.tiempo_imagen = registro[0].tiempo_imagen;

          this.carrusel = 0;
          this.reproducir()
        
        }
      }
    })
  }

  reproducir()
  {
    if (this.router.url == "/carrusel")
    {
      this.segundosEspera = 0;
      if (this.router.url != "/carrusel")
      {
        return;  
      }
      this.carrusel = this.carrusel + 1;
      if (this.carrusel > 7)
      {
        this.carrusel = 1;
      }
      if (this.carrusel == 1 && this.grafico01)
      {
          if (this.ultimo != 1)
          {
            this.fallas = [];
          } 
          this.vistaGrafico = 1;
          this.escape = +this.duracion01 * 1000;
          this.graficar();  
      }
      else if (this.carrusel == 2 && this.grafico02)
      {
        if (this.ultimo != 2)
          {
            this.fallas = [];
          }
          this.vistaGrafico = 2;
          this.escape = +this.duracion02 * 1000;
          this.graficar();  
      }
      else if (this.carrusel == 3 && this.grafico03)
      {
        if (this.ultimo != 3)
          {
            this.fallas = [];
          }
          this.vistaGrafico = 3;
          this.escape = +this.duracion03 * 1000;
          this.graficar();  
      }
      else if (this.carrusel == 4 && this.grafico04)
      {
        if (this.ultimo != 4)
          {
            this.fallas = [];
          }
        
        this.vistaGrafico = 4;
        this.escape = +this.duracion04 * 1000;
        this.graficar();
      }
      else if (this.carrusel == 5 && this.grafico05)
      {
        if (this.ultimo != 5)
          {
            this.fallas = [];
          }
        
        this.vistaGrafico = 5;
        this.escape = +this.duracion05 * 1000;
        this.graficar();
      }
      else if (this.carrusel == 6 && this.grafico06)
      {
        if (this.ultimo != 6)
          {
            this.fallas = [];
          }
        
        this.ultimo = 6
        
        this.vistaGrafico = 6;
        this.escape = +this.duracion06 * 1000;
        this.llenarRegistros();
      }
      else if (this.carrusel == 7 && this.tiempo_imagen > 0)
      {
        this.ultimo = 7
        this.servicio.mensajeInferior.emit("");
        //se buscan las imagenes
          this.vistaGrafico = 7;
            this.buscarImagenes();
        }
      else
      {
        setTimeout(() => {
          this.reproducir();
        }, 100);
      }
    }
  }

  buscarImagenes()
  {
  this.aImagenes = 0;
  this.imagenes = [];
  let camposcab={accion: 9000};  
  this.altoPG1IMG = this.altoPG1 - 20;
  this.servicio.consultasBD(camposcab).subscribe((data2: any []) =>{
    if (data2) 
    {
      if (data2[0]=="vacio")
      {
        this.reproducir();     
      }
      else
      {
        data2.forEach((elemento, index) => {
          this.imagenes.push({imagen: this.URL_BASE + elemento});
          if (index == data2.length-1)
          {
            this.tImagenes = data2.length;
            this.mostrarImagenes();
          }
        })
      } 
    }
  })

}

mostrarImagenes()
{
  
  this.aImagenes = this.aImagenes + 1;
  
  if (this.aImagenes <= this.tImagenes)
  {
    this.servicio.mensajeInferior.emit("Imagenes institucionales (" + this.aImagenes + " de " + this.tImagenes + ")");
    this.state = "out";
    setTimeout(() => {
      this.cargarImagen();  
    }, 300);
  }
  else 
  {
    this.miImagen = "";
    this.reproducir();
  }
}

cargarImagen()
{
  this.state = "in";
  
  this.miImagen = this.imagenes[this.aImagenes - 1].imagen;
  var img = document.getElementById('fotografia');
  
  
  
    if (this.router.url != "/carrusel")
    {
      return;  
    }
    else
    {
      setTimeout(() => {
        this.mostrarImagenes();
      }, +this.tiempo_imagen * 1000);
    }
  
}



  poblarGrafico() {
    //Se calcula la fecha
    
    this.buscarFechas(this.periodo_tipo, this.periodo_atras);
    
    let fHasta = this.servicio.rFechaHasta();
    let fDesde = this.servicio.rFechaDesde();

    this.sub_titulo = this.servicio.rEstacion();
    
    if (this.vistaGrafico == 1)
    {
      this.animarGrafico = this.ultimo != 1;
      this.nombreArchivo = "Llamadas por estacion";
      if (!this.sub_titulo)
      {
        this.tituloGrafica = "LLAMADAS POR ESTACION"
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }
      this.servicio.mensajeInferior.emit(this.tituloGrafica + " - " + this.textoPeriodo);
      
      let consulta = "SELECT vw_alarmas.estacion AS estacion, SUM(IF(vw_alarmas.reporte > 0, 1, 0)) AS total, SUM(IF(vw_alarmas.tiempo > 0 AND vw_reportes.escalamientos = 0, 1, 0)) AS buenas, SUM(IF(vw_alarmas.tiempo > 0 AND vw_reportes.escalamientos > 0, 1, 0)) AS tarde, SUM(IF(vw_alarmas.tiempo = 0, 1, 0)) AS noatendio FROM sigma.vw_alarmas LEFT JOIN sigma.vw_reportes ON vw_alarmas.reporte = vw_reportes.id WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' GROUP BY vw_alarmas.estacion ORDER BY 2 DESC";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) 
        {
          //Se borran si todos son cero
          for (let j = registro.length - 1; j>=0; j--)
          {
              if (+registro[j].total + +registro[j].buenas + +registro[j].tarde + +registro[j].noatendio == 0 )
              {
                registro.splice(j, 1);  
              }
              else
              {
                if (!registro[j].estacion)
                {
                  registro[j].estacion = "N/A";
                }
              }
              
          }
          registro.forEach((elemento) => {
            total = total + +elemento.total;
          });
          let borrarDesde: number = this.maximo_barras;
          let total: number = 0;
          if (this.maximo_barraspct > 0) {
            registro.forEach((elemento) => {
              total = total + +elemento.total;
            });
            let pctAcum: number = 0;
            let uIndice: number = 0;
            registro.forEach((elemento, index) => {
              pctAcum = pctAcum + (+elemento.total / total)
              if (pctAcum > (+this.maximo_barraspct / 100) && borrarDesde == 0) {
                borrarDesde = index + 1;
              }
            });
          }
          if (borrarDesde < this.maximo_barras) {
            borrarDesde = this.maximo_barras;
          }
          if (borrarDesde > 0 && registro.length > borrarDesde) {
            let campo1: number = 0;
            let campo2: number = 0;
            let campo3: number = 0;
            let campo4: number = 0;
            let consolidados: number = 0;
            registro.forEach((elemento, index) => {
              if (index + 1 > borrarDesde - 1) {
                if (this.agrupar) {
                  consolidados = consolidados + 1;
                  campo1 = campo1 + +elemento.total;
                  campo2 = campo2 + +elemento.buenas;
                  campo3 = campo3 + +elemento.tarde;
                  campo4 = campo4 + +elemento.noatendio;
                }
              }
            });
            registro.splice(borrarDesde - 1);
            if (this.agrupar) {
              registro.push({ estacion: 'VARIOS (' + consolidados + ')', total: campo1, buenas: campo2, tarde: campo3, noatendio: campo4 });
              if (!this.agrupar_alfinal) {
                registro.sort(this.descendenteTotal);
              }
            }
          }
          
          if ( JSON.stringify(this.fallas) != JSON.stringify(registro))
          {
            this.fallas = registro;
            let maximo = registro[0].total;
          registro.forEach(element => {
            if (+maximo < +element.total)
            {
              maximo = element.total
            }
          });
          //maximo = +maximo + Math.round(+maximo * 0.2);
          //if (maximo == registro[0].total)
          //{
          //  maximo = maximo + 1;
          //}
          this.maxmin ={startValue: 0, endValue: maximo};
          this.intervalo = Math.round(maximo / 10);
          if (this.intervalo == 0)
          {
            this.intervalo = 1;
          }
            
            //maximo = +maximo + Math.round(+maximo * 0.2);
            //if (maximo == registro[0].total)
            //{
            //  maximo = maximo + 1;
            //}
            this.columnasTabla = [];

            this.columnasTabla.push('Atencion');
            //Se arma la tabla
            registro.forEach((elemento) => {
              let estacionN = elemento.estacion;
              if (!elemento.estacion)
              {
                estacionN = "N/A";
              }
              this.columnasTabla.push(estacionN);
            });

            let misDatos = this.fallas.slice();
            misDatos.unshift({ estacion: "Atencion", total: 'Total', buenas: this.alto_etiqueta, tarde: this.escaladas_etiqueta, noatendio: this.noatendio_etiqueta});
            this.listaLlamadas = misDatos;
          }
          this.verGrafico = true;
          this.hayDatos = true;
          this.ultimo = 1;

          if (this.router.url == "/carrusel")
          {
            setTimeout(() => {
                this.segundosEspera = this.segundosEspera + 1;
                if (this.segundosEspera > this.duracion01)
                {
                  this.reproducir()
                }
                else
                {
                  this.graficar();
                }
            }, 1000);
          }
        }
        else
        {
          this.ultimo = 1;
          setTimeout(() => {
            this.reproducir();
          }, 3000);
          this.verGrafico = true;
          this.hayDatos = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class-red";
          mensajeCompleto.mensaje = "No se hallaron datos para el reporte";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          
        }
      })
    }
    else if (this.vistaGrafico == 2)
    {
      this.animarGrafico = this.ultimo != 2;
      this.nombreArchivo = "Fallas y tiempos por estacion";
      this.tituloGrafica = "FALLAS POR ESTACION (FRECUENCIA Y TIEMPO)"
      this.literalGrafico = "Nombre de la estacion"
      if (!this.sub_titulo)
      {
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }

      this.servicio.mensajeInferior.emit(this.tituloGrafica + " - " + this.textoPeriodo);
      let aOrden=" 2"
      //this.sub_titulo = fDesde + " al " + fHasta;
      if (this.orden == "T")
      {
        aOrden =" 3"
      }
      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT vw_alarmas.estacion AS estacion, COUNT(*) AS total, ROUND(SUM(vw_alarmas.tiempo) / 60)  AS tiempo FROM sigma.vw_alarmas WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' AND vw_alarmas.tiempo > 0 GROUP BY vw_alarmas.estacion ORDER BY " + aOrden + " DESC";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) {
          let borrarDesde: number = this.maximo_barras;
          let total: number = 0;
          if (this.maximo_barraspct > 0) {
            registro.forEach((elemento) => {
              total = total + +elemento.total;
            });
            let pctAcum: number = 0;
            let uIndice: number = 0;
            registro.forEach((elemento, index) => {
              pctAcum = pctAcum + (+elemento.total / total)
              if (pctAcum > (+this.maximo_barraspct / 100) && borrarDesde == 0) {
                borrarDesde = index + 1;
              }
            });
          }
          if (borrarDesde < this.maximo_barras) {
            borrarDesde = this.maximo_barras;
          }
          if (borrarDesde > 0 && registro.length > borrarDesde) {
            let campo1: number = 0;
            let campo2: number = 0;
            let consolidados: number = 0;
            registro.forEach((elemento, index) => {
              if (index + 1 > borrarDesde - 1) {
                if (this.agrupar) {
                  consolidados = consolidados + 1;
                  campo1 = campo1 + +elemento.total;
                  campo2 = campo2 + +elemento.tiempo;
                }
              }
            });
            registro.splice(borrarDesde - 1);
            if (this.agrupar) {
              registro.push({ estacion: 'VARIOS (' + consolidados + ')', total: campo1, tiempo: campo2});
              if (!this.agrupar_alfinal) {
                registro.sort(this.descendenteTotal);
              }
            }
          }
          if ( JSON.stringify(this.fallas) != JSON.stringify(registro))
          {
          
            let maximo = registro[0].total;
            registro.forEach(element => {
              if (+maximo < +element.total)
              {
                maximo = element.total
              }
            });
            //maximo = +maximo + Math.round(+maximo * 0.2);
            //if (maximo == registro[0].total)
            //{
            //  maximo = maximo + 1;
            //}
            this.maxmin ={startValue: 0, endValue: maximo};
            this.intervalo = Math.round(maximo / 10);
            if (this.intervalo == 0)
            {
              this.intervalo = 1;
            }
  
            
            maximo = registro[0].tiempo;
            registro.forEach(element => {
              if (+maximo < +element.tiempo)
              {
                maximo = element.tiempo;
              }
            });
                        //maximo = +maximo + Math.round(+maximo * 0.2);
            //if (maximo == registro[0].total)
            //{
            //  maximo = maximo + 1;
            //}
            this.maxmin2 = {startValue: 0, endValue: maximo};
            this.intervalo2 = Math.round(maximo / 10);
            if (this.intervalo2 == 0)
            {
              this.intervalo2 = 1;
            }

            this.fallas = registro;
          }
          this.verGrafico = true;
          this.hayDatos = true;
          this.ultimo = 2;
          if (this.router.url == "/carrusel")
          {
            setTimeout(() => {
                this.segundosEspera = this.segundosEspera + 1;
                if (this.segundosEspera > this.duracion02)
                {
                  this.reproducir()
                }
                else
                {
                  this.graficar();
                }
            }, 1000);
          }
        }
        else
        {
          this.ultimo =2;
          setTimeout(() => {
            this.reproducir();
          }, 3000);
          this.verGrafico = true;
          this.hayDatos = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class-red";
          mensajeCompleto.mensaje = "No se hallaron datos para el reporte";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          
        }
      })
    }
    else if (this.vistaGrafico == 3)
    {
      this.animarGrafico = this.ultimo != 3;
      this.nombreArchivo = "Fallas y tiempos por tecnologia";
      this.tituloGrafica = "FALLAS POR TECNOLOGÍA (FRECUENCIA Y TIEMPO)"
      this.literalGrafico = "Nombre de la tecnologia"
      if (!this.sub_titulo)
      {
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }
      this.servicio.mensajeInferior.emit(this.tituloGrafica + " - " + this.textoPeriodo);
      let aOrden=" 2"
      //this.sub_titulo = fDesde + " al " + fHasta;
      if (this.orden == "T")
      {
        aOrden =" 3"
      }
      
      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT tecnologia AS estacion, COUNT(*) AS total, ROUND(SUM(vw_alarmas.tiempo) / 60) AS tiempo FROM sigma.vw_alarmas WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' AND vw_alarmas.tiempo > 0 GROUP BY tecnologia ORDER BY " + aOrden + " DESC";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) 
        {
          let borrarDesde: number = this.maximo_barras;
          let total: number = 0;
          if (this.maximo_barraspct > 0) 
          {
            registro.forEach((elemento) => {
              total = total + +elemento.total;
            });
            let pctAcum: number = 0;
            let uIndice: number = 0;
            registro.forEach((elemento, index) => {
              pctAcum = pctAcum + (+elemento.total / total)
              if (pctAcum > (+this.maximo_barraspct / 100) && borrarDesde == 0) {
                borrarDesde = index + 1;
              }
            });
          }
          if (borrarDesde < this.maximo_barras) {
            borrarDesde = this.maximo_barras;
          }
          if (borrarDesde > 0 && registro.length > borrarDesde) 
          {
            let campo1: number = 0;
            let campo2: number = 0;
            let consolidados: number = 0;
            registro.forEach((elemento, index) => {
              if (index + 1 > borrarDesde - 1) {
                if (this.agrupar) {
                  consolidados = consolidados + 1;
                  campo1 = campo1 + +elemento.total;
                  campo2 = campo2 + +elemento.tiempo;
                }
              }
            });
            registro.splice(borrarDesde - 1);
            if (this.agrupar) {
              registro.push({ estacion: 'VARIOS (' + consolidados + ')', total: campo1, tiempo: campo2});
              if (!this.agrupar_alfinal) {
                registro.sort(this.descendenteTotal);
              }
            }
          }
          if ( JSON.stringify(this.fallas) != JSON.stringify(registro))
          {
          
            registro.forEach((elemento) => {
              if (!elemento.estacion)
              {
                elemento.estacion = "N/A";
              }
            });
            let maximo = registro[0].total;
            registro.forEach(element => {
              if (+maximo < +element.total)
              {
                maximo = element.total
              }
            });
            //maximo = +maximo + Math.round(+maximo * 0.2);
            //if (maximo == registro[0].total)
            //{
            //  maximo = maximo + 1;
            //}
            this.maxmin ={startValue: 0, endValue: maximo};
            this.intervalo = Math.round(maximo / 10);
            if (this.intervalo == 0)
            {
              this.intervalo = 1;
            }
  
            
            maximo = registro[0].tiempo;
            registro.forEach(element => {
              if (+maximo < +element.tiempo)
              {
                maximo = element.tiempo;
              }
            });
                       //maximo = +maximo + Math.round(+maximo * 0.2);
            //if (maximo == registro[0].total)
            //{
            //  maximo = maximo + 1;
            //}
            this.maxmin2 ={startValue: 0, endValue: maximo};
            this.intervalo2 = Math.round(maximo / 10);
            if (this.intervalo2 == 0)
            {
              this.intervalo2 = 1;
            }

            this.fallas = registro;
          }
          this.verGrafico = true;
          this.hayDatos = true;
          this.ultimo = 3;
          if (this.router.url == "/carrusel")
          {
            setTimeout(() => {
                this.segundosEspera = this.segundosEspera + 1;
                if (this.segundosEspera > this.duracion03)
                {
                  this.reproducir()
                }
                else
                {
                  this.graficar();
                }
            }, 1000);
          }
          
        }
        else
        {
          this.ultimo = 3;
          setTimeout(() => {
            this.reproducir();
          }, 3000);
          this.verGrafico = true;
          this.hayDatos = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class-red";
          mensajeCompleto.mensaje = "No se hallaron datos para el reporte";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
       
        }
      })
    }
    else if (this.vistaGrafico == 4)
    {
      this.nombreArchivo = "Top 10 de fallas";
      this.tituloGrafica = "TOP DE DE FALLAS"
      this.literalGrafico = "Nombre de la tecnologia"
      this.mostrar_tabla = false;
      if (!this.sub_titulo)
      {
        this.sub_titulo = "";  
      }
      this.servicio.mensajeInferior.emit(this.tituloGrafica + " - " + this.textoPeriodo);
      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT 0 AS num, estacion, descripcion, responsable, COUNT(*) AS total, ROUND(SUM(vw_alarmas.tiempo) / 60) AS tiempo FROM sigma.vw_alarmas WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' AND vw_alarmas.tiempo > 0 GROUP BY estacion, descripcion, responsable ORDER BY 5 DESC, 6 DESC LIMIT 10";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) {
          if ( JSON.stringify(this.fallas) != JSON.stringify(registro))
          {
          
            let linea = 0;
            registro.forEach((elemento, index) => {
              linea = linea + 1;
              elemento.num = linea;
            });
            this.fallas = registro;
          }
          this.verGrafico = true;
          this.hayDatos = true;
          this.ultimo = 4;
          if (this.router.url == "/carrusel")
          {
            setTimeout(() => {
                this.segundosEspera = this.segundosEspera + 1;
                if (this.segundosEspera > this.duracion04)
                {
                  this.reproducir()
                }
                else
                {
                  this.graficar();
                }
            }, 1000);
          }
        }
        else
        {
          this.ultimo = 4;
          setTimeout(() => {
            this.reproducir();
          }, 3000);
          this.verGrafico = true;
          this.hayDatos = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class-red";
          mensajeCompleto.mensaje = "No se hallaron datos para el reporte";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
      
        }
      })
    }
    if (this.vistaGrafico == 5)
    {
      this.ultimo = 5;
      this.animarGrafico = this.ultimo != 5;
      this.nombreArchivo = "Rendimiento por staff";
      if (!this.sub_titulo)
      {
        this.tituloGrafica = "RENDIMIENTO POR STAFF"
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }
      this.servicio.mensajeInferior.emit(this.tituloGrafica + " - " + this.textoPeriodo);
      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT vw_alarmas.responsable AS estacion, 0 AS pctchar, 0 AS pct, '' as prom, SUM(vw_alarmas.tiempo) AS tiempo,  SUM(IF(vw_alarmas.tiempo > 0, 1, 0)) AS total, SUM(IF(vw_alarmas.tiempo > 0 AND vw_reportes.escalamientos = 0, 1, 0)) AS buenas, SUM(IF(vw_alarmas.tiempo > 0 AND vw_reportes.escalamientos > 0, 1, 0)) AS tarde, SUM(IF(vw_alarmas.tiempo = 0, 1, 0)) AS noatendio FROM sigma.vw_alarmas LEFT JOIN sigma.vw_reportes ON vw_alarmas.reporte = vw_reportes.id WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' GROUP BY vw_alarmas.responsable ORDER BY vw_alarmas.responsable";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) {
    
          let campo1: number = 0;
          let campo2: number = 0;
          let campo3: number = 0;
          let campo4: number = 0;
          let campo5: number = 0;
          registro.forEach((elemento, index) => {
            campo1 = campo1 + +elemento.total;
            campo2 = campo2 + +elemento.buenas;
            campo3 = campo3 + +elemento.tarde;
            campo4 = campo4 + +elemento.noatendio;
            campo5 = campo5 + +elemento.tiempo;
            if (!elemento.estacion)
            {
              elemento.estacion = "N/A";
            }
            elemento.prom = this.calcularProm(+elemento.tiempo / +elemento.total)
            //elemento.prom = Math.round((+elemento.tiempo / 60) / +elemento.total) + "min"
            if (+elemento.buenas + +elemento.tarde > 0)
            {
              elemento.pct = Math.round((+elemento.buenas / (+elemento.buenas + +elemento.tarde)) * 100)
            }
            else
            {
              elemento.pct = 0;
            }
            elemento.pctchar = elemento.pct + "%"
          });
          let eProm = this.calcularProm(campo5 / campo1)
          if (!this.cad_consolidado)
          {
            this.cad_consolidado = "CONSOLIDADO"
          }
          //let eProm = Math.round((campo5 / 60) / campo1) + "min"
          registro.unshift({estacion: this.cad_consolidado, total: campo1, buenas: campo2, tarde: campo3, noatendio: campo4, tiempo: campo5, prom: eProm, pct: (campo2 + campo3 > 0 ? Math.round((campo2 / (campo2 + campo3)) * 100) : 0), pctchar: (campo2 + campo3 > 0 ? Math.round((campo2 / (campo2 + campo3)) * 100)+ "%" : "0%") })
          this.fallas = registro;          
          this.verGrafico = true;
          this.hayDatos = true;
          if (this.router.url == "/carrusel")
          {
            setTimeout(() => {
                this.segundosEspera = this.segundosEspera + 1;
                if (this.segundosEspera > this.duracion05)
                {
                  this.reproducir()
                }
                else
                {
                  this.graficar();
                }
            }, 1000);
          }
        }
        else
        {
          setTimeout(() => {
            this.reproducir();
          }, 3000);
          this.verGrafico = true;
          this.hayDatos = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class-red";
          mensajeCompleto.mensaje = "No se hallaron datos para el reporte";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
       
        }
      })
    }
  }

  calcularProm(segundos: number)
  {
    segundos = Math.round(segundos);
    let horas = Math.floor(segundos / 3600);
    let minutos = Math.floor((segundos % 3600) / 60);
    segundos = segundos % 60 ; 
    //Se redondean los minutos
    if (segundos > 30) 
    { 
      minutos = minutos + 1;
    }
    if (minutos == 0 && horas == 0)
      {
        minutos = 1;
      }
    let strminutos= '' +  minutos;
    let strsegundos= '' + segundos;
    
      //  if (segundos < 10) 
    //  { 
    //    strsegundos = '0' + segundos;
    //  }     
    
      //
    if (minutos < 10) 
      { 
        strminutos = '0' + minutos;
      }
         
    return horas + ":" + strminutos //+ ":" + strsegundos;
  }

  calcularPantalla()
  {
    let alto = window.innerHeight// != window.screen.height==window.screen.height == window.innerHeight) 
    let ancho = window.innerWidth // != window.screen.height==window.screen.height == window.innerHeight) 
    this.altoPG1 = Math.round(alto) - 115;
    this.anchoPG1 = Math.round(ancho) - this.servicio.rAnchoSN()-10;
    if (this.vistaGrafico==1)
    {
      this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 260 : this.altoPG1);
    }
    else
    {
      this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 290 : this.altoPG1);
    }
    
    this.anchoGrafica = this.anchoPG1 - 110;
    this.altoTabla = this.altoPG1 - this.altoGrafica
  }

  buscarFechas(periodos: number, nper: number) {
    let tipo = periodos;
    let desde = new Date();
    let hasta = new Date();
    this.textoPeriodo = "";
    if (tipo == 0) {
        desde.setSeconds(desde.getSeconds() - nper);
        this.textoPeriodo = (nper == 1 ? "Un segundo atrás" : nper + " segundos atrás");
      }
      else if (tipo == 1) {
        desde.setMinutes(desde.getMinutes() - nper);
        this.textoPeriodo = (nper == 1 ? "Un minuto atrás" : nper + " minutos atrás");
      }
      else if (tipo == 2) {
        desde.setHours(desde.getHours() - nper);
        this.textoPeriodo = (nper == 1 ? "Una hora atrás" : nper + " horas atrás");
      }
      else if (tipo == 3) {
        desde.setDate(desde.getDate() - nper);
        this.textoPeriodo = (nper == 1 ? "Un día atrás" : nper + " días atrás");
      }
      else if (tipo == 4) {
        desde.setDate(desde.getDate() - (nper * 7));
        this.textoPeriodo = (nper == 1 ? "Una semana atrás" : nper + " semanas atrás");
      }
      else if (tipo == 5) {
        desde.setMonth(desde.getMonth() - nper);
        this.textoPeriodo = (nper == 1 ? "Un mes atrás" : nper + " meses atrás");
      }
      else if (tipo == 6) {
        desde.setMonth(desde.getMonth() - (nper * 12));
        this.textoPeriodo = (nper == 1 ? "Un año atrás" : nper + " años atrás");
    }
    if (tipo <= 2) {
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(desde), "yyyy/MM/dd HH:mm:ss"));
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(hasta), "yyyy/MM/dd") + " 23:59:59");
    }
    else if (tipo <= 10) {
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(desde), "yyyy/MM/dd") + " 00:00:00");
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(hasta), "yyyy/MM/dd") + " 23:59:59");
      if (tipo <= 10 && !this.textoPeriodo)
      {
        this.textoPeriodo = "Lo que va del día" 
      }
    }
    else if (tipo == 12) {
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(desde), "yyyy/MM") + "/01 00:00:00");
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(hasta), "yyyy/MM/dd") + " 23:59:59");
      this.textoPeriodo = "Lo que va del mes";
    }
    else if (tipo == 13) {
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(desde), "yyyy") + "/01/01 00:00:00");
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(hasta), "yyyy/MM/dd") + " 23:59:59");
      this.textoPeriodo = "Lo que va del año";
    }
    else if (tipo == 11) {
      if (desde.getDay() == 0) {
        //domingo
        desde.setDate(desde.getDate() - 6);
      }
      else {
        desde.setDate(desde.getDate() - (desde.getDay() - 1));
      }
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(desde), "yyyy/MM/dd") + " 00:00:00");
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(hasta), "yyyy/MM/dd") + " 23:59:59");
      this.textoPeriodo = "Lo que va de semana";
    }
    else if (tipo == 20) {
      desde.setDate(desde.getDate() - 1);
      hasta = desde;
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(desde), "yyyy/MM/dd") + " 00:00:00");
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(hasta), "yyyy/MM/dd") + " 23:59:59");
      this.textoPeriodo = "El día de ayer";
    }
    else if (tipo == 22) {
      let mesTemp = new Date(this.datepipe.transform(new Date(desde), "yyyy/MM") + "/01 00:00:00");
      mesTemp.setDate(mesTemp.getDate() - 1);
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(mesTemp), "yyyy/MM/dd") + " 23:59:59");
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(mesTemp), "yyyy/MM") + "/01 00:00:00");
      this.textoPeriodo = "El mes pasado";
    }
    else if (tipo == 23) {
      let mesTemp = new Date(this.datepipe.transform(new Date(desde), "yyyy") + "/01/01 00:00:00");
      mesTemp.setDate(mesTemp.getDate() - 1);
      this.servicio.aFechaHasta(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/01/01 23:59:59");
      this.servicio.aFechaDesde(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/12/31 00:00:00");
      this.textoPeriodo = "El mes pasado";
    }
    else if (tipo == 21) {
      if (desde.getDay() == 0) {
        //domingo
        let date3 = new Date();
        date3.setDate(date3.getDate() - 13);
        let date4 = new Date();
        date4.setDate(date4.getDate() - 7);
        this.servicio.aFechaDesde(this.datepipe.transform(new Date(date3), "yyyy/MM/dd") + " 00:00:00");
        this.servicio.aFechaHasta(this.datepipe.transform(new Date(date4), "yyyy/MM/dd") + " 23:59:59");  
        this.textoPeriodo = "Lo semana pasada";
      }
      else {
        let date2 = new Date();
        let date = new Date();
        date2.setDate(date2.getDate() - (date2.getDay()));
        this.servicio.aFechaHasta(this.datepipe.transform(new Date(date2), "yyyy/MM/dd") + " 23:59:59");  
        date.setDate(date.getDate() - (date.getDay() - 1) - 7);
        this.servicio.aFechaDesde(this.datepipe.transform(new Date(date), "yyyy/MM/dd") + " 00:00:00");
        this.textoPeriodo = "Lo semana pasada";
      }
    }
  }

ascendenteTotal(a, b)
{
  let comparison = 0;
  if (+a.total > +b.total) {
    comparison = 1;
  } else if (+a.total < +b.total) {
    comparison = -1;
  }
  return comparison;
}

descendenteTotal(a, b)
{
  let comparison = 0;
  if (+a.total < +b.total) {
    comparison = 1;
  } else if (+a.total > +b.total) {
    comparison = -1;
  }
  return comparison;
}


filtrar()
{
  const dialogRef = this.dialog.open(GraficaParamComponent, {
    width: '500px', height: '400px', data: { id: 0, accion: 0 }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result.accion == 1) {
      this.icono_filtrar = "filtrar_aj";
      this.graficar()
      //Se cancela la llamada
    }
  });
}

formato()
{
  const dialogRef = this.dialog.open(GraficaFormatComponent, {
    width: '590px', height: '500px', data: { id: 0, accion: 0, tipo: this.vistaGrafico }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result.accion == 1) {
      this.graficar()
      //Se cancela la llamada
    }
  });
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
          this.totalRegistros = (this.registros.length == 0 ? 'NO HAY FALLAS' : (this.registros.length == 1 ? 'Una falla' : this.registros.length + ' fallas')) + ' en la lista';  
        this.servicio.mensajeInferior.emit(this.totalRegistros);
        if (this.vistaGrafico == 6)
        {
          if (this.router.url == "/carrusel")
          {
            setTimeout(() => {
                this.segundosEspera = this.segundosEspera + 1;
                if (this.segundosEspera > this.duracion06)
                {
                  this.reproducir()
                }
                else
                {
                  this.llenarRegistros();
                }
            }, 1000);
          }
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
}
