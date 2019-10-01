import { Component, OnInit, AfterContentInit, Inject, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { DxChartComponent } from "devextreme-angular";
import { GraficaParamComponent } from '../grafica-param/grafica-param.component';
import { GraficaFormatComponent } from '../grafica-format/grafica-format.component';
import { DatePipe } from '@angular/common'
import { createHostListener } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
})
export class GraficaComponent implements AfterContentInit {

  @ViewChild(DxChartComponent, { static: true }) chart: DxChartComponent;
  @ViewChild("txtBuscar", { static: true }) miEemento: ElementRef;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    
    this.calcularPantalla()    
  }

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
  textoPeriodo: string = "";
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
  maxmin: {startValue: 0, endValue: 20};
  intervalo: number = 1;
  maxmin2: {startValue: 0, endValue: 20};
  intervalo2: number = 1;
  
  literalGrafico: string = ""
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
  sideNav: boolean = true;
  altoGrafica: number = 200;
  anchoGrafica: number = 200;
  altoTabla: number = 300;
  verGrafico: boolean = false;
  cad_consolidado: string = "CONSOLIDADO";
  hayDatos: boolean = false;
  
  fallas: any[] = [];
  valoresBuscar: any[] = ['total', 'buenas', 'tarde', 'noatendio'];
  chart_visualRange = [0, 100];
  verRates: boolean = true;
  ayuda01: string = "Aplica un filtro a los datos de la gráfica";
  ayuda02: string = "Cambia el formato de la gráfica";
  ayuda03: string = "Exporta la gráfica y los datos que la conforman";

  columnasTabla = [];

  constructor(
    public datepipe: DatePipe,  
    private servicio: ServicioService,
    public dialog: MatDialog,
    private route: Router) 
   {
    if (this.servicio.rUsuario().rol==0)
      {
        this.route.navigateByUrl('/home');
      }
     
    this.servicio.refrescarGrafico.subscribe((accion: boolean) => {
      
      setTimeout(() => {
        this.calcularPantalla()    
      }, 300);

    }
    );
    this.servicio.refrescarVista.subscribe((accion: boolean) => {
      this.verGrafico = false;
      this.configuracion();
      this.graficar()
    });
  }

  graficar() {
    this.vistaGrafico = this.servicio.rGraficoEditar()
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
          this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 250 : this.altoPG1);
        }
        else
        {
          this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 280 : this.altoPG1);
        }
        this.anchoGrafica = this.anchoPG1 - 110;
        this.altoTabla = this.altoPG1 - this.altoGrafica
        this.poblarGrafico();
      }
    })
  }

  ngAfterContentInit() {
    this.servicio.teclaBuscar.subscribe((accion: boolean)=>{
      this.buscar();
      }
    );
    this.configuracion();
    this.calcularPantalla()
    this.graficar();
    
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
          this.bajo_hasta = registro[0].bajo_hasta;
          
          this.bajo_color = registro[0].bajo_color;
          this.bajo_color = this.bajo_color.replace("HEX", "#");
          
          this.bajo_etiqueta = registro[0].bajo_etiqueta;
          this.medio_hasta = registro[0].medio_hasta;

          this.medio_color = registro[0].medio_color;
          this.medio_color = this.medio_color.replace("HEX", "#");
          
          this.medio_etiqueta = registro[0].medio_etiqueta;
          
          this.alto_color = registro[0].alto_color;
          this.alto_color = this.alto_color.replace("HEX", "#");

          this.alto_etiqueta = registro[0].alto_etiqueta;

          this.escaladas_color = registro[0].escaladas_color;
          this.escaladas_color= this.escaladas_color.replace("HEX", "#");

          this.escaladas_etiqueta = registro[0].escaladas_etiqueta;
          
          this.noatendio_color = registro[0].noatendio_color;
          this.noatendio_color= this.noatendio_color.replace("HEX", "#");

          this.noatendio_etiqueta = registro[0].noatendio_etiqueta;
          this.bajo_color_todo = "0px 0px 4px 4px " + this.bajo_color
          this.medio_color_todo = "0px 0px 4px 4px " + this.medio_color
          this.alto_color_todo = "0px 0px 4px 4px " + this.alto_color
          this.cad_consolidado = registro[0].cad_consolidado
        }
      }
    })
  }

  poblarGrafico() {
    //Se calcula la fecha
    
    this.fallas = [];
    if (!this.servicio.rFSesion())
    {
      this.buscarFechas(this.periodo_tipo, this.periodo_atras);
    }
    else
    {
      this.textoPeriodo = this.servicio.rTextoPer();
    }

      
    
    let fHasta = this.servicio.rFechaHasta();
    let fDesde = this.servicio.rFechaDesde();

    this.sub_titulo = this.servicio.rEstacion();
    
    if (this.vistaGrafico == 1)
    {
      this.nombreArchivo = "Llamadas por estacion";
      if (!this.sub_titulo)
      {
        this.tituloGrafica = "LLAMADAS POR ESTACION" + " - " + this.textoPeriodo;
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }
      
      let consulta = "SELECT vw_alarmas.estacion AS estacion, SUM(IF(vw_alarmas.reporte > 0, 1, 0)) AS total, SUM(IF(vw_alarmas.tiempo > 0 AND vw_reportes.escalamientos = 0, 1, 0)) AS buenas, SUM(IF(vw_alarmas.tiempo > 0 AND vw_reportes.escalamientos > 0, 1, 0)) AS tarde, SUM(IF(vw_alarmas.tiempo = 0, 1, 0)) AS noatendio FROM sigma.vw_alarmas LEFT JOIN sigma.vw_reportes ON vw_alarmas.reporte = vw_reportes.id WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' GROUP BY vw_alarmas.estacion ORDER BY 2 DESC";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) 
        {
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
          let maximo = registro[0].total;
          registro.forEach(element => {
            if (maximo < element.total)
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

   
          this.fallas = registro;
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

          let misDatos = this.fallas;
          misDatos.unshift({ estacion: "Atencion", total: 'Total', buenas: this.alto_etiqueta, tarde: this.escaladas_etiqueta, noatendio: this.noatendio_etiqueta});
          this.listaLlamadas = misDatos;
          this.verGrafico = true;
          this.hayDatos = true;
        }
        else
        {
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
      this.nombreArchivo = "Fallas y tiempos por estacion";
      this.tituloGrafica = "FALLAS POR ESTACION (FRECUENCIA Y TIEMPO)"  + " - " + this.textoPeriodo;
      this.literalGrafico = "Nombre de la estacion"
      if (!this.sub_titulo)
      {
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }

      let aOrden=" 2"
      //this.sub_titulo = fDesde + " al " + fHasta;
      if (this.orden == "T")
      {
        aOrden =" 3"
      }
      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT vw_alarmas.estacion AS estacion, COUNT(*) AS total, ROUND(SUM(vw_alarmas.tiempo) / 60, 1) AS tiempo FROM sigma.vw_alarmas WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' AND vw_alarmas.tiempo > 0 GROUP BY vw_alarmas.estacion ORDER BY " + aOrden + " DESC";
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
          this.verGrafico = true;
          this.hayDatos = true;
        }
        else
        {
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
      this.nombreArchivo = "Fallas y tiempos por tecnologia";
      this.tituloGrafica = "FALLAS POR TECNOLOGÍA (FRECUENCIA Y TIEMPO)"  + " - " + this.textoPeriodo;
      this.literalGrafico = "Nombre de la tecnologia"
      if (!this.sub_titulo)
      {
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }
      let aOrden=" 2"
      //this.sub_titulo = fDesde + " al " + fHasta;
      if (this.orden == "T")
      {
        aOrden =" 3"
      }
      
      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT tecnologia AS estacion, COUNT(*) AS total, ROUND(SUM(vw_alarmas.tiempo) / 60, 1) AS tiempo FROM sigma.vw_alarmas WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' AND vw_alarmas.tiempo > 0 GROUP BY tecnologia ORDER BY " + aOrden + " DESC";
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
          this.verGrafico = true;
          this.hayDatos = true;
          
        }
        else
        {
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
      this.tituloGrafica = "TOP DE DE FALLAS"  + " - " + this.textoPeriodo;
      this.literalGrafico = "Nombre de la tecnologia"
      this.mostrar_tabla = false;
      if (!this.sub_titulo)
      {
        this.sub_titulo = "";  
      }

      //this.sub_titulo = fDesde + " al " + fHasta;
      let consulta = "SELECT 0 AS num, estacion, descripcion, responsable, COUNT(*) AS total, ROUND(SUM(vw_alarmas.tiempo) / 60, 1) AS tiempo FROM sigma.vw_alarmas WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' AND vw_alarmas.tiempo > 0 GROUP BY estacion, descripcion, responsable ORDER BY 5 DESC, 6 DESC LIMIT 10";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
        if (registro && registro.length > 0) {
          let linea = 0;
          registro.forEach((elemento, index) => {
            linea = linea + 1;
            elemento.num = linea;
          });
          this.fallas = registro;
          this.verGrafico = true;
          this.hayDatos = true;
        }
        else
        {
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
      this.nombreArchivo = "Rendimiento por staff";
      if (!this.sub_titulo)
      {
        this.tituloGrafica = "RENDIMIENTO POR STAFF"  + " - " + this.textoPeriodo;
        this.sub_titulo = "TODAS LAS ESTACIONES";  
      }

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
            campo2 = campo2 + (+elemento.buenas);
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
        }
        else
        {
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
    this.altoPG1 = Math.round(alto) - 160;
    this.anchoPG1 = Math.round(ancho) - this.servicio.rAnchoSN()-10;
    if (this.vistaGrafico==1)
    {
      this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 250 : this.altoPG1);
    }
    else
    {
      this.altoGrafica = (this.mostrar_tabla ? this.altoPG1 - 280 : this.altoPG1);
    }
    
    this.anchoGrafica = this.anchoPG1 - 110;
    this.altoTabla = this.altoPG1 - this.altoGrafica
  }

  buscarFechas(periodos: number, nper: number) 
  {
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
        this.textoPeriodo = (nper == 1 ? "Una día atrás" : nper + " días atrás");
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
        this.textoPeriodo = "La semana pasada";
      }
      else {
        let date2 = new Date();
        let date = new Date();
        date2.setDate(date2.getDate() - (date2.getDay()));
        this.servicio.aFechaHasta(this.datepipe.transform(new Date(date2), "yyyy/MM/dd") + " 23:59:59");  
        date.setDate(date.getDate() - (date.getDay() - 1) - 7);
        this.servicio.aFechaDesde(this.datepipe.transform(new Date(date), "yyyy/MM/dd") + " 00:00:00");
        this.textoPeriodo = "La semana pasada";
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
    width: '500px', height: '340px', data: { id: 0, accion: 0 }
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

exportar()
{
  if (this.vistaGrafico == 1)
  {
  if (this.chart)
  {
    
    
  }

    let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = "Grafica: " + this.titulo + "\r\n";
        exportCSV = exportCSV + "Generada en fecha: " + this.servicio.fecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n" + "\r\n";;
        this.columnasTabla.forEach((elementos) => {
          exportCSV = exportCSV + elementos+ ",";
        })
        exportCSV = exportCSV + "\r\n";
        let lineas: number = 0;
        
        this.fallas.forEach((elementos) => {
            exportCSV = exportCSV + '"' + elementos.total + '",';
        })
        exportCSV = exportCSV + "\r\n";
        
        this.fallas.forEach((elementos) => {
          exportCSV = exportCSV + '"' + elementos.buenas + '",';
        })
        exportCSV = exportCSV + "\r\n";

        this.fallas.forEach((elementos) => {
          exportCSV = exportCSV + '"' + elementos.tarde + '",';
        })
        exportCSV = exportCSV + "\r\n";
        lineas = -1;
        this.fallas.forEach((elementos) => {
          lineas = lineas + 1
          exportCSV = exportCSV + '"' + elementos.noatendio + '",';
        })
        exportCSV = exportCSV + "\r\n" + "\r\n";
        exportCSV = exportCSV + '"Total estacion(es): "' + lineas
        var blob = new Blob([exportCSV], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
        let link = document.createElement('a')
        link.download = "Llamadas por estacion.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
    }
    else if (this.vistaGrafico == 2)
    {
  
      let exportCSV: string = "";
  
          // Loop the array of objects
          exportCSV = "Grafica: " + this.titulo + "\r\n";
          exportCSV = exportCSV + "Generada en fecha: " + this.servicio.fecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n" + "\r\n";;
          exportCSV = exportCSV + this.literalGrafico + '","Total llamadas","Tiempo total min,"'  + "\r\n";
          let lineas = 0;
          this.fallas.forEach((elementos) => {
            lineas = lineas + 1
            exportCSV = exportCSV + '"' + elementos.estacion + '",';
            exportCSV = exportCSV + '"' + +elementos.total + '",';
            exportCSV = exportCSV + '"' + +elementos.tiempo + '"' + "\r\n";
          })
          exportCSV = exportCSV + "\r\n" + "\r\n";
          exportCSV = exportCSV + '"Total estacion(es): "' + lineas
          var blob = new Blob([exportCSV], {type: 'text/csv' }),
          url = window.URL.createObjectURL(blob);
          let link = document.createElement('a')
          link.download = "Llamadas y tiempos por estacion.csv";
          link.href = url
          link.click()
          window.URL.revokeObjectURL(url);
          link.remove();
      }
    else if (this.vistaGrafico == 3)
    {
  
      let exportCSV: string = "";
  
          // Loop the array of objects
          exportCSV = "Grafica: " + this.titulo + "\r\n";
          exportCSV = exportCSV + "Generada en fecha: " + this.servicio.fecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n" + "\r\n";;
          exportCSV = exportCSV + this.literalGrafico + '","Total llamadas","Tiempo total min,"'  + "\r\n";
          let lineas = 0;
          this.fallas.forEach((elementos) => {
              lineas = lineas + 1
            exportCSV = exportCSV + '"' + elementos.estacion + '",';
            exportCSV = exportCSV + '"' + +elementos.total + '",';
            exportCSV = exportCSV + '"' + +elementos.tiempo + '"' + "\r\n";
          })
          exportCSV = exportCSV + "\r\n" + "\r\n";
          exportCSV = exportCSV + '"Total estacion(es): "' + lineas
          var blob = new Blob([exportCSV], {type: 'text/csv' }),
          url = window.URL.createObjectURL(blob);
          let link = document.createElement('a')
          link.download = "Llamadas y tiempos por tecnologia.csv";
          link.href = url
          link.click()
          window.URL.revokeObjectURL(url);
          link.remove();
      }
      else if (this.vistaGrafico == 4)
    {
  
      let exportCSV: string = "";
  
          // Loop the array of objects
          exportCSV = "Repporte: Top 10 de fallas\r\n";
          exportCSV = exportCSV + "Generada en fecha: " + this.servicio.fecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n" + "\r\n";;
          exportCSV = exportCSV + '"Estacion", "Falla (codigo)","Area responsable","Frecuencia","Tiempo total min,"'  + "\r\n";
          let lineas = 0;
          let tiempo = 0;
          let fallas = 0;
          this.fallas.forEach((elementos) => {
              lineas = lineas + 1
              tiempo = tiempo + +elementos.tiempo;
              fallas = fallas + +elementos.total
            exportCSV = exportCSV + '"' + elementos.estacion + '",';
            exportCSV = exportCSV + '"' + elementos.falla + '",';
            exportCSV = exportCSV + '"' + elementos.responsable + '",';
            exportCSV = exportCSV + '"' + +elementos.total + '",';
            exportCSV = exportCSV + '"' + +elementos.tiempo + '"' + "\r\n";
          })
          exportCSV = exportCSV + "\r\n";
          exportCSV = exportCSV + '"","","",' + fallas + ',' + tiempo 
          var blob = new Blob([exportCSV], {type: 'text/csv' }),
          url = window.URL.createObjectURL(blob);
          let link = document.createElement('a')
          link.download = "Top 10 de fallas.csv";
          link.href = url
          link.click()
          window.URL.revokeObjectURL(url);
          link.remove();
      }
  }

escapar()
{
  this.buscar()
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

}
