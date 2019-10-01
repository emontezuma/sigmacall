import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-cnfigurar',
  templateUrl: './cnfigurar.component.html',
  styleUrls: ['./cnfigurar.component.css']
})
export class CnfigurarComponent implements OnInit {

  @ViewChild("txtC", { static: true }) txtC: ElementRef;
  @ViewChild("txtP", { static: true }) txtP: ElementRef;
  @ViewChild("txtPt", { static: true }) txtPt: ElementRef;
  @ViewChild("txtH", { static: true }) txtH: ElementRef;
  
  listas = [];
  revisar_cada: number = 60;

  puerto_comm1: string = "";
  puerto_comm1_par: string = "";
  puerto_comm2: string = "";
  puerto_comm2_par: string = "";
  puerto_comm3: string = "";
  puerto_comm3_par: string = "";
  puerto_comm4: string = "";
  puerto_comm4_par: string = "";
  puerto_comm5: string = "";
  puerto_comm5_par: string = "";
  puerto_comm6: string = "";
  puerto_comm6_par: string = "";
  ruta_sms: string = "";
  ruta_audios: string = "";
  ruta_archivos_enviar: string = "";
  server_mmcall: string = "";
  cad_consolidado: string = "";
  optimizar_llamada: boolean = true;
  optimizar_sms: boolean = true;
  optimizar_correo: boolean = true;
  optimizar_mmcall: boolean = true;
  utilizar_arduino: boolean = true;
  mantener_prioridad: boolean = true;
  voz_predeterminada: string = "";
  escape_mmcall: boolean = true;
  escape_mmcall_mensaje: string = "";
  escape_mmcall_lista: number = 0;
  escape_mmcall_cancelar: boolean = false;
  escape_llamadas: boolean = true;
  escape_accion: string = "";
  escape_lista: number = 0;
  escape_mensaje: string = "";
  escape_mensaje_propio: boolean = true;
  veces_reproducir: number = 0;
  gestion_meses: number = 0;
  correo_titulo_falla: boolean = true;
  correo_titulo: string = "";
  correo_cuerpo: string = "";
  correo_firma: string = "";
  timeout_llamadas: number = 0;
  timeout_sms: number = 0;
  traducir: boolean = true;
  tiempo_corte: number = 0;
  timeout_fallas: number = 0;

  bajo_hasta: string = "";
  bajo_color: string = "";
  bajo_etiqueta: string = "";

  medio_hasta: string = "";
  medio_color: string = "";
  medio_etiqueta: string = "";

  alto_color: string = "";
  alto_etiqueta: string = "";

  noatendio_color: string = "";
  noatendio_etiqueta: string = "";

  escaladas_color: string = "";
  escaladas_etiqueta: string = "";

  textoSalir: string = "Salir";
  accionado: boolean = false;
  



  ayuda01: string = "Especifique los parámetros del puerto Serial en este orden: BaudRate, DataBits, Parity, StopBits, Handshake, RtsEnable";
  
  constructor(
    public dialogRef: MatDialogRef<CnfigurarComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  recuperar()
  {
    let consulta = "SELECT * from sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.revisar_cada = registro[0].revisar_cada;
        this.puerto_comm1 = registro[0].puerto_comm1;
        this.puerto_comm1_par = registro[0].puerto_comm1_par;
        this.puerto_comm2 = registro[0].puerto_comm2;
        this.puerto_comm2_par = registro[0].puerto_comm2_par;
        this.puerto_comm3 = registro[0].puerto_comm3;
        this.puerto_comm3_par = registro[0].puerto_comm3_par;
        this.puerto_comm4 = registro[0].puerto_comm4;
        this.puerto_comm4_par = registro[0].puerto_comm4_par;
        this.puerto_comm5 = registro[0].puerto_comm5;
        this.puerto_comm5_par = registro[0].puerto_comm5_par;
        this.puerto_comm6 = registro[0].puerto_comm6;
        this.ruta_sms = registro[0].ruta_sms;
        this.ruta_audios = registro[0].ruta_audios;
        this.ruta_archivos_enviar = registro[0].ruta_archivos_enviar;
        this.server_mmcall = registro[0].server_mmcall;
        this.cad_consolidado = registro[0].cad_consolidado;
        
        this.optimizar_llamada = registro[0].optimizar_llamada == "S"; 
        this.optimizar_sms = registro[0].optimizar_sms == "S"; 
        this.optimizar_correo = registro[0].optimizar_correo == "S"; 
        this.optimizar_mmcall = registro[0].optimizar_mmcall == "S"; 
        this.utilizar_arduino = registro[0].utilizar_arduino == "S"; 
        this.mantener_prioridad = registro[0].mantener_prioridad == "S"; 
        this.voz_predeterminada = registro[0].voz_predeterminada;

        this.escape_mmcall = registro[0].escape_mmcall == "S"; 
        this.escape_mmcall_mensaje = registro[0].escape_mmcall_mensaje;
        this.escape_mmcall_lista = registro[0].escape_mmcall_lista;
        this.escape_mmcall_cancelar = registro[0].escape_mmcall_cancelar == "S"; 
        
        this.escape_llamadas = registro[0].escape_llamadas; 
        this.escape_accion = registro[0].escape_accion;
        this.escape_lista = registro[0].escape_lista;
        this.escape_mensaje = registro[0].escape_mensaje;
        this.escape_mensaje_propio = registro[0].escape_mensaje_propio == "S";

        this.veces_reproducir = registro[0].veces_reproducir;
        this.gestion_meses = registro[0].gestion_meses;
        
        this.correo_titulo_falla = registro[0].correo_titulo_falla == "S";
        this.correo_titulo = registro[0].correo_titulo;
        this.correo_cuerpo = registro[0].correo_cuerpo;
        this.correo_firma = registro[0].correo_firma;
        
        this.timeout_llamadas = registro[0].timeout_llamadas;
        this.timeout_fallas = registro[0].timeout_fallas;
        this.timeout_sms = registro[0].timeout_sms;

        this.traducir = registro[0].traducir == "S";

        this.tiempo_corte = registro[0].tiempo_corte;

        this.bajo_color = registro[0].bajo_color;
        this.bajo_color = this.bajo_color.replace("HEX", "#");

        this.medio_color = registro[0].medio_color;
        this.medio_color = this.medio_color.replace("HEX", "#");

        this.alto_color = registro[0].alto_color;
        this.alto_color = this.alto_color.replace("HEX", "#");

        this.noatendio_color = registro[0].noatendio_color;
        this.noatendio_color = this.noatendio_color.replace("HEX", "#");

        this.escaladas_color = registro[0].escaladas_color;
        this.escaladas_color = this.escaladas_color.replace("HEX", "#");

        this.bajo_hasta = registro[0].bajo_hasta;
        this.bajo_etiqueta = registro[0].bajo_etiqueta;
        this.medio_hasta = registro[0].medio_hasta;
        this.medio_etiqueta = registro[0].medio_etiqueta;
        this.alto_etiqueta = registro[0].alto_etiqueta;
        this.noatendio_etiqueta = registro[0].noatendio_etiqueta;
        this.escaladas_etiqueta = registro[0].escaladas_etiqueta;

      }
    })  
  }

  ngOnInit() {

    this.llenarLD();
    this.recuperar();
  }


  cancelar()
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  validar()
 {
    if (!this.revisar_cada) 
    {
      this.txtC.nativeElement.focus();
      return;
    }

    let consulta = "SELECT COUNT(*) AS cuenta from sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro)
      {
        if (registro[0].cuenta==0)
        {
          consulta = "INSERT INTO sigma.vw_configuracion (revisar_cada) VALUES (0)";
          let campos = {accion: 2000, consulta: consulta};  
            this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
              this.guardar();
            })
        }
        else
        {
          this.guardar();
        }
      }
    }) 

  }

  guardar()
 {

  let bajo_color = this.bajo_color;
  bajo_color  = bajo_color.replace("#", "HEX");

  let medio_color = this.medio_color;
  medio_color  = medio_color.replace("#", "HEX");

  let alto_color = this.alto_color;
  alto_color  = alto_color.replace("#", "HEX");

  let noatendio_color = this.noatendio_color;
  noatendio_color  = noatendio_color.replace("#", "HEX");
  
  let escaladas_color = this.escaladas_color;
  escaladas_color  = escaladas_color.replace("#", "HEX");

  let ruta_archivos_enviar  = this.ruta_archivos_enviar.replace(/\\/g, "\\\\");; 
  let ruta_audios  = this.ruta_audios.replace(/\\/g, "\\\\");; 
  let ruta_sms  = this.ruta_sms.replace(/\\/g, "\\\\");; 

  let consulta = "UPDATE sigma.vw_configuracion SET alto_color = '" + alto_color + "', alto_etiqueta = '" + this.alto_etiqueta + "', bajo_color = '" + bajo_color + "', bajo_etiqueta = '" + this.bajo_etiqueta + "', bajo_hasta = " + +this.bajo_hasta + ", cad_consolidado = '" + this.cad_consolidado + "', correo_cuerpo = '" + this.correo_cuerpo + "', correo_firma = '" + this.correo_firma + "', correo_titulo = '" + this.correo_titulo + "', correo_titulo_falla = '" + (this.correo_titulo_falla ? "S" : "N") + "', escaladas_color = '" + escaladas_color + "', escaladas_etiqueta = '" + this.escaladas_etiqueta + "', escape_accion = '" + this.escape_accion + "', escape_lista = " + +this.escape_lista + ", escape_llamadas = " + +this.escape_llamadas + ", escape_mensaje = '" + this.escape_mensaje + "', escape_mensaje_propio = '" + (this.escape_mensaje_propio ? "S" : "N") + "', gestion_meses = " + +this.gestion_meses + ", mantener_prioridad = '" + (this.mantener_prioridad ? "S" : "N") + "', medio_color = '" + medio_color + "', medio_etiqueta = '" + this.medio_etiqueta + "', medio_hasta = " + +this.medio_hasta + ", noatendio_color = '" + noatendio_color + "', noatendio_etiqueta = '" + this.noatendio_etiqueta + "', optimizar_correo = '" + (this.optimizar_correo ? "S" : "N") + "', optimizar_llamada = '" + (this.optimizar_llamada ? "S" : "N") + "', optimizar_mmcall = '" + (this.optimizar_mmcall ? "S" : "N") + "', optimizar_sms = '" + (this.optimizar_sms ? "S" : "N") + "', puerto_comm1 = '" + this.puerto_comm1 + "', puerto_comm1_par = '" +  this.puerto_comm1_par + "', puerto_comm2 = '" + this.puerto_comm2 + "', puerto_comm2_par = '" + this.puerto_comm2_par + "', puerto_comm3 = '" + this.puerto_comm3 + "', puerto_comm3_par = '" + this.puerto_comm3_par +"', puerto_comm4 = '" + this.puerto_comm4 + "', puerto_comm4_par = '" + this.puerto_comm4_par + "', puerto_comm5 = '" + this.puerto_comm5 + "', puerto_comm5_par = '" + this.puerto_comm5_par + "', puerto_comm6 = '" + this.puerto_comm6 + "', puerto_comm6_par = '" + this.puerto_comm6_par + "', revisar_cada = " + +this.revisar_cada + ", ruta_archivos_enviar = '" +  ruta_archivos_enviar + "', ruta_audios = '" + ruta_audios + "', ruta_sms = '" + ruta_sms + "', server_mmcall = '" + this.server_mmcall + "', timeout_llamadas = " + +this.timeout_llamadas + ", timeout_fallas = " + +this.timeout_fallas + ", timeout_sms = " + +this.timeout_sms + ", traducir = '" + (this.traducir ? "S" : "N") + "', utilizar_arduino = '" + (this.utilizar_arduino ? "S" : "N") + "', veces_reproducir = " + +this.veces_reproducir + ", voz_predeterminada = '" + this.voz_predeterminada + "'"
  let campos = {accion: 2000, consulta: consulta};  
  this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
    this.datos.accion = 1;
    this.dialogRef.close(this.datos);
  })
}

  cambiando(event: any)
  {
    this.textoSalir = "Cancelar";
    this.accionado = true;
  }

  llenarLD()
  {
    this.listas = [];
    let consulta = "SELECT a.id, a.nombre as cadena FROM cat_distribucion AS a WHERE a.estatus = 'A' ORDER BY a.nombre";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      if (datos)
      {
        this.listas = datos;
        this.listas.unshift({id: 0, cadena: "(Sin asignar)"});
      }
      else
      {
        this.listas.unshift({id: 0, cadena: "(Sin asignar)"});
      }
    })
  }
  
}
