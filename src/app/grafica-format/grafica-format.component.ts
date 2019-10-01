import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { GeneralComponent } from '../general/general.component';

@Component({
  selector: 'app-grafica-format',
  templateUrl: './grafica-format.component.html',
  styleUrls: ['./grafica-format.component.css']
})

export class GraficaFormatComponent implements OnInit {

  fecha1 = new Date();
  fecha2 = new Date();
  habFecha: boolean = true;  
  errorFecha: boolean = true;
  miPeriodo: string = "1";
  
  mensajeFecha: string = "";

  
  @ViewChild("txtN", { static: true }) txtN: ElementRef;
  @ViewChild("txtTiempo", { static: true }) txtTiempo: ElementRef;
  
  titulo_fuente: string = "10";
  titulo: string = "";
  color_fondo_barras: string = "";
  color_leyenda: string = "";
  color_letras: string = "";
  color_fondo: string = "";
  sub_titulo_fuente: number = 10;
  sub_titulo: string = "";
  margen_arriba: number  = 10;
  margen_abajo: number  = 10;
  margen_izquierda: number  = 10;
  margen_derecha: number  = 10;
  etiqueta_fuente: string = "10";
  etiqueta_leyenda: string = "10";
  texto_x: string = "";
  texto_x_fuente: string = "";
  texto_y: string = "";
  texto_y_fuente: string = "";
  orden: string = "";
  ancho: number = 0;
  alto: number = 0;
  pantallaAlto: number = 400;
  pantallaAncho: number = 600;
  maximo_barras: number = 6;
  maximo_barraspct: number = 6;
  agrupar: boolean = false;
  agrupar_alfinal: boolean = false;
  periodo_tipo: number = 0;
  periodo_atras: number = 1;
  mostrar_tabla: boolean = false;
  icono_filtrar: string = "filtrar";
  fuentes = 
  [ {id: "8", fuente: "8px"},
    {id: "9", fuente: "9px"},
    {id: "10", fuente: "10px"},
    {id: "11", fuente: "11px"},
    {id: "12", fuente: "12px"},
    {id: "13", fuente: "13px"},
    {id: "14", fuente: "14px"},
    {id: "15", fuente: "15px"},
    {id: "16", fuente: "16px"},
    {id: "17", fuente: "17px"},
    {id: "18", fuente: "18px"},
    {id: "19", fuente: "19px"},
    {id: "20", fuente: "20px"},
    {id: "21", fuente: "21px"},
    {id: "22", fuente: "22px"},
    {id: "23", fuente: "23px"},
    {id: "24", fuente: "24px"},
    {id: "25", fuente: "25px"},
    {id: "26", fuente: "26px"},
    {id: "27", fuente: "27px"},
    {id: "28", fuente: "28px"},
    {id: "29", fuente: "29px"},
    {id: "30", fuente: "30px"},
    {id: "31", fuente: "31px"},
    {id: "32", fuente: "32px"},
    {id: "33", fuente: "33px"},
    {id: "34", fuente: "34px"},
    {id: "35", fuente: "35px"},
    {id: "36", fuente: "36px"},
    {id: "37", fuente: "37px"},
    {id: "38", fuente: "38px"},
    {id: "39", fuente: "39px"},
    {id: "40", fuente: "40px"},
    {id: "41", fuente: "41px"},
    {id: "42", fuente: "42px"},
    {id: "43", fuente: "43px"},
    {id: "44", fuente: "44px"},
    {id: "45", fuente: "45px"},
    {id: "46", fuente: "46px"},
    {id: "47", fuente: "47px"},
    {id: "48", fuente: "48px"},
    {id: "49", fuente: "49px"},
    {id: "50", fuente: "50px"},

  ]
  
  constructor(
    public dialogRef: MatDialogRef<GraficaFormatComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  recuperarPU(tipo: number)
  {
    let cadUsuario = " (usuario = " + this.servicio.rUsuario().id + " OR usuario = 0) "
    if (tipo == 1) 
    {
      cadUsuario = " (usuario = 0) ";
    } 
    let consulta = "SELECT * from sigma.pu_graficos WHERE grafico = " + this.servicio.rGraficoEditar() + " AND " + cadUsuario + " ORDER BY usuario DESC LIMIT 1";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.titulo = registro[0].titulo;
        this.titulo_fuente = registro[0].titulo_fuente; 
        //this.sub_titulo = registro[0].sub_titulo;
        this.color_fondo_barras = registro[0].color_fondo_barras;
        this.color_fondo_barras = this.color_fondo_barras.replace("HEX", "#");
          
        this.color_letras = registro[0].color_letras;
        this.color_letras = this.color_letras.replace("HEX", "#");
        
        this.color_fondo = registro[0].color_fondo;
        this.color_fondo = this.color_fondo.replace("HEX", "#");
        
        this.color_leyenda = registro[0].color_leyenda;
        this.color_leyenda = this.color_leyenda.replace("HEX", "#");

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
        this.periodo_tipo = registro[0].periodo_tipo ; 
        this.periodo_atras = registro[0].periodo_atras ; 
        this.orden = registro[0].orden ; 
        this.mostrar_tabla = registro[0].mostrar_tabla == "S"; 
        if (+this.titulo_fuente == 0)
        {
          this.titulo_fuente = "10";
        }
        if (+this.texto_y_fuente == 0)
        {
          this.texto_y_fuente = "10";
        }
        if (+this.texto_x_fuente == 0)
        {
          this.texto_x_fuente = "10";
        }
        if (+this.etiqueta_fuente == 0)
        {
          this.etiqueta_fuente = "10";
        }
        if (+this.etiqueta_leyenda == 0)
        {
          this.etiqueta_leyenda = "10";
        }
      }
    })  
  }

  ngOnInit() {
    
    this.recuperarPU(0);
  }


  cancelar()
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  recuperar()
  {
    this.recuperarPU(1);
  }

  validar()
 {
   if (this.servicio.rUsuario().id == 0)
   {
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '480px', height: '250px', data: { titulo: "No se puede cambiar el formato", mensaje: "Para cambiar las propiedades de un gráfico primero debe ingresar al sistema", alto: "70", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
      });
    }
    else
    {
      this.errorFecha = false;

      if (+this.periodo_tipo <= 7 && !+this.periodo_atras) 
      {
        this.txtTiempo.nativeElement.focus();
        return;
      }

      let consulta = "SELECT COUNT(*) AS cuenta from sigma.pu_graficos WHERE grafico = " + this.servicio.rGraficoEditar() + " AND usuario = " + this.servicio.rUsuario().id;
      let campos = {accion: 100, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
        if (registro)
        {
          let nColorFondo = this.color_fondo;
          if (nColorFondo)
          {
            nColorFondo = nColorFondo.replace("#", "HEX");
          }

          let nColorTexto = this.color_letras;
          if (nColorTexto)
          {
          nColorTexto = nColorTexto.replace("#", "HEX");
          }

          let nColorLeyenda = this.color_leyenda;
          if (nColorLeyenda)
          {
            nColorLeyenda = nColorLeyenda.replace("#", "HEX");
          }

          let nColorFBarras = this.color_fondo_barras;
          if (nColorFBarras)
          {
            nColorFBarras = nColorFBarras.replace("#", "HEX");
          }
          
          if (registro[0].cuenta==0)
          {
            //Nuevo registro
            consulta = "INSERT INTO sigma.pu_graficos (usuario, grafico, titulo, titulo_fuente, texto_x, texto_x_fuente, texto_y, texto_y_fuente, etiqueta_fuente, etiqueta_leyenda, maximo_barras, maximo_barraspct, agrupar, agrupar_alfinal, periodo_tipo, periodo_atras, mostrar_tabla, orden, color_fondo_barras, color_fondo, color_letras, color_leyenda) VALUES (" + this.servicio.rUsuario().id + ", " + this.servicio.rGraficoEditar() + ", '" + this.titulo + "', " + +this.titulo_fuente + ", '" + this.texto_x + "', " + +this.texto_x_fuente + ", '"  + this.texto_y + "', " + +this.texto_y_fuente + ", " + +this.etiqueta_fuente + ", " + +this.etiqueta_leyenda + ", " + +this.maximo_barras+ ", " + +this.maximo_barraspct + ", '" + (this.agrupar ? "S" : "N") + "', '" + (this.agrupar_alfinal ? "S" : "N") + "', " + +this.periodo_tipo + ", " + +this.periodo_atras + ", '" + (this.mostrar_tabla ? "S" : "N") + "', '" + this.orden + "', '" + nColorFBarras + "', '" + nColorFondo + "', '" + nColorTexto + "', '" + nColorLeyenda + "');"
          }
          else
          {
            consulta = "UPDATE sigma.pu_graficos SET color_fondo_barras = '" + nColorFBarras + "', color_leyenda = '" + nColorLeyenda + "', color_fondo = '" + nColorFondo + "', color_letras = '" + nColorTexto  + "', usuario = " + this.servicio.rUsuario().id  + ", titulo = '" + this.titulo + "', titulo_fuente = " + +this.titulo_fuente + ", texto_x = '" + this.texto_x + "', texto_x_fuente = " + +this.texto_x_fuente + ", texto_y = '" + this.texto_y + "', texto_y_fuente = " + +this.texto_y_fuente + ", etiqueta_fuente = " + +this.etiqueta_fuente + ", etiqueta_leyenda = " + +this.etiqueta_leyenda + ", maximo_barras = " + +this.maximo_barras + ", maximo_barraspct = " + +this.maximo_barraspct + ", agrupar = '" + (this.agrupar ? "S" : "N") + "', agrupar_alfinal = '" + (this.agrupar_alfinal ? "S" : "N") + "', periodo_tipo = " + +this.periodo_tipo + ", periodo_atras = " + +this.periodo_atras + ", orden = '" + this.orden + "', mostrar_tabla = '" + (this.mostrar_tabla ? "S" : "N") + "' WHERE usuario = " + this.servicio.rUsuario().id + " AND grafico = " + this.servicio.rGraficoEditar()
          }
          let campos = {accion: 2000, consulta: consulta};  
            this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
              this.datos.accion = 1;
              this.dialogRef.close(this.datos);
            })
        }
      }) 
    }
  }
 
}
