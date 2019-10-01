import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatSelect, MatCheckbox } from '@angular/material';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { GeneralComponent } from '../general/general.component';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-recipiente',
  templateUrl: './recipiente.component.html',
  styleUrls: ['./recipiente.component.css']
})
export class RecipienteComponent implements OnInit {

  validado: boolean = false;
  validado_BD: boolean = false;
  listas: any = [];
  estaciones: any = [];
  
  isHandset: boolean = false;
  registroActual: string = " (nuevo)";
  nombre: string = "";
  estatus: boolean = true;
  solapar: boolean = false;
  informar: boolean = true;
  estatusAntes: boolean = true;
  prefijo: string = "";
  referencia: string = "";
  notas: string = "";
  imagen: string = "./assets/icons/recipiente.svg";
  textoSalir: string = "Salir";
  accionado: boolean = false;
  encontrado: boolean = false;
  ayuda01: string = "Escape: aplicará para las fallas que no tengan una alerta configurada";
  ayuda02: string = "Si una falla está configurada en más de una alerta, se aplicará la alerta con la prioridad más alta";
  ayuda03: string = "Indique si desea que la alerta se genere cuando se acumule un cierto número de fallas en un lapso de tiempo dado";
  ayuda04: string = "Repetir los mensajes de alerta a la misma lista de distribución del primer nivel";
  ayuda05: string = "Escalar los mensajes de alerta a una nueva lista de distribución";
  ayuda06: string = "Especifique el mensaje a enviar cuando se acumulen las fallas";
  ayuda07: string = "Especifique la acción a tomar cuando se agoten los intentos de llamada telefónica (voz)";
  ayuda11: string = "Activa/inactiva el registro de fallas seleccionado";
  ayuda12: string = "Elimina el registro de fallas seleccionado";
  ayuda13: string = "Este registro está inactivo";
  miAcumular: string = "N";
  miRepetir: string = "N";
  miRepetirEs1: string = "N";
  miRepetirEs2: string = "N";
  miRepetirEs3: string = "N";
  miRepetirEs4: string = "N";
  miRepetirEs5: string = "N";
  miComparacion: string = "1";
  miEstacion: string = "(Cualquiera)";
  miEstacionEscape: string = "(Cualquiera)";
  cadenaComp: string = "";
  miTipo: string = "1";
  miPrioridad: string = "3";
  veces: number = 0;
  tiempo: number = 0;
  reiniciar: boolean = true;
  
  miMensaje: string = "T";
  personalizado: string = "";
  mensajeEsc: string = "";

  tiemporep: number = 0;
  segundosrepHR: string = "0.00hr";
  tiempoesc1: number = 0;
  segundosesc1HR: string = "0.00hr";
  tiempoesc2: number = 0;
  segundosesc2HR: string = "0.00hr";
  tiempoesc3: number = 0;
  segundosesc3HR: string = "0.00hr";
  tiempoesc4: number = 0;
  segundosesc4HR: string = "0.00hr";
  tiempoesc5: number = 0;
  segundosesc5HR: string = "0.00hr";

  acumular_separado: boolean = false;
  escape_llamadas: string = "3";
  miEscape: string = "N";

  log1: boolean = true;
  sms1: boolean = false;
  llamada1: boolean = false;
  correo1: boolean = false;
  mmcall1: boolean = false;

  log1rep: boolean = true;
  sms1rep: boolean = false;
  llamada1rep: boolean = false;
  correo1rep: boolean = false;
  mmcall1rep: boolean = false;

  logesc1: boolean = true;
  smsesc1: boolean = false;
  llamadaesc1: boolean = false;
  correoesc1: boolean = false;
  mmcallesc1: boolean = false;
  repetir1: boolean = false;

  logesc2: boolean = true;
  smsesc2: boolean = false;
  llamadaesc2: boolean = false;
  correoesc2: boolean = false;
  mmcallesc2: boolean = false;
  repetir2: boolean = false;

  logesc3: boolean = true;
  smsesc3: boolean = false;
  llamadaesc3: boolean = false;
  correoesc3: boolean = false;
  mmcallesc3: boolean = false;
  repetir3: boolean = false;

  logesc4: boolean = true;
  smsesc4: boolean = false;
  llamadaesc4: boolean = false;
  correoesc4: boolean = false;
  mmcallesc4: boolean = false;
  repetir4: boolean = false;

  logesc5: boolean = true;
  smsesc5: boolean = false;
  llamadaesc5: boolean = false;
  correoesc5: boolean = false;
  mmcallesc5: boolean = false;
  repetir5: boolean = false;


  Requerido01: boolean = false;
  miLista0: number = 0;
  miLista1: number = 0;
  miLista2: number = 0;
  miLista3: number = 0;
  miLista4: number = 0;
  miLista5: number = 0;
  miListaE: number = 0;
  tFallas: number = 10;

  uCreacion: string = "";
  uCambio: string = "";

  fCreacion: any = "";
  fCambio: any = "";

  columnasTabla = ['comparacion', 'prefijo', 'estacion', 'estatus', 'iconos'];
  listaFallas = new MatTableDataSource();
  
  @ViewChild("mPersonalizado", { static: true }) mPersonalizado: ElementRef;
  @ViewChild("txtR", { static: true }) txtNombre: ElementRef;
  @ViewChild("txtHits", { static: true }) txtHits: ElementRef;
  @ViewChild("txtTiempo", { static: true }) txtTiempo: ElementRef;
  @ViewChild("miLog1", { static: true }) chkLog1: MatCheckbox;
  @ViewChild("lista0", { static: true }) lista0: MatSelect;
  @ViewChild("txtTiemporep", { static: true }) txtTiemporep: ElementRef;
  @ViewChild("miLog1rep", { static: true }) chkLog1rep: MatCheckbox;
  @ViewChild("txtTiempoesc1", { static: true }) txtTiempoesc1: ElementRef;
  @ViewChild("miLogesc1", { static: true }) chkLogesc1: MatCheckbox;
  @ViewChild("lista1", { static: true }) lista1: MatSelect;
  @ViewChild("txtTiempoesc2", { static: true }) txtTiempoesc2: ElementRef;
  @ViewChild("miLogesc2", { static: true }) chkLogesc2: MatCheckbox;
  @ViewChild("lista2", { static: true }) lista2: MatSelect;
  @ViewChild("txtTiempoesc3", { static: true }) txtTiempoesc3: ElementRef;
  @ViewChild("miLogesc3", { static: true }) chkLogesc3: MatCheckbox;
  @ViewChild("lista3", { static: true }) lista3: MatSelect;
  @ViewChild("txtTiempoesc4", { static: true }) txtTiempoesc4: ElementRef;
  @ViewChild("miLogesc4", { static: true }) chkLogesc4: MatCheckbox;
  @ViewChild("lista4", { static: true }) lista4: MatSelect;
  @ViewChild("txtTiempoesc5", { static: true }) txtTiempoesc5: ElementRef;
  @ViewChild("miLogesc5", { static: true }) chkLogesc5: MatCheckbox;
  @ViewChild("lista5", { static: true }) lista5: MatSelect;
  @ViewChild("listaE", { static: true }) listaE: MatSelect;
  @ViewChild("txtME", { static: true }) txtME: ElementRef;
  @ViewChild("txtR", { static: true }) txtR: ElementRef;
  @ViewChild("txtCadenaComp", { static: true }) txtCadenaComp: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<RecipienteComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) 
  { 
  }

  ngOnInit()
   {
    
      
    this.llenarLD();
    this.llenarEstaciones();
    if (this.datos.id != 0)
      {
        this.recuperar();
      }
      this.isHandset = window.innerWidth < 600;
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

  llenarEstaciones()
  {
    this.estaciones = [];
    let consulta = "SELECT ESTACION FROM infofallas.catalogo GROUP BY ESTACION ORDER BY ESTACION";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      if (datos)
      {
        this.estaciones = datos;
        this.estaciones.unshift({ESTACION: "(Cualquiera)"});
      }
      else
      {
        this.estaciones.unshift({ESTACION: "(Cualquiera)"});
      }
    })
    
  }
  cancelar()
  {
    if (this.textoSalir=="Salir")
    {
      this.datos.accion = 0;
      this.dialogRef.close(this.datos);
    }
    else
    {
      this.recuperar();
      this.textoSalir = "Salir";
      this.accionado = false;
    }
  }

  recuperar()
  {
    let consulta = "SELECT vw_alertas.*, a.nombre AS creador, b.nombre AS modificador FROM sigma.vw_alertas LEFT JOIN cat_usuarios AS a ON vw_alertas.creado = a.id LEFT JOIN cat_usuarios AS b ON vw_alertas.modificado = b.id WHERE vw_alertas.id = " + this.datos.id;
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.registroActual = " (ID: " + this.datos.id + ")"
        this.nombre = registro[0].nombre;
        this.referencia = registro[0].referencia;
        this.notas = registro[0].notas;
        this.estatus = (registro[0].estatus =="A" ? true : false);
        this.solapar = (registro[0].solapar =="S" ? true : false);
        this.informar = (registro[0].informar_resolucion =="S" ? true : false);
        this.estatusAntes = this.estatus;
        this.miPrioridad = registro[0].prioridad;
        this.miComparacion = "1";
        this.cadenaComp = "";
        this.miEstacion = "(Cualquiera)";
        this.miEstacionEscape = registro[0].escape_estacion;
        this.miAcumular = registro[0].acumular;
        this.veces = registro[0].acumular_veces;
        this.reiniciar = registro[0].acumular_inicializar=="S";
        this.tiempo = registro[0].acumular_tiempo;
        this.miMensaje = registro[0].acumular_tipo_mensaje;
        this.personalizado = registro[0].acumular_mensaje;
        this.log1 = registro[0].log == "S";
        this.sms1 = registro[0].sms== "S";
        this.llamada1 = registro[0].llamada== "S";
        this.correo1 = registro[0].correo== "S";
        this.mmcall1 = registro[0].mmcall== "S";
        this.miLista0 = registro[0].lista;
        this.miRepetir = registro[0].repetir;
        this.tiemporep = registro[0].repetir_tiempo;
        this.log1rep = registro[0].repetir_log== "S";
        this.sms1rep = registro[0].repetir_sms== "S";
        this.correo1rep = registro[0].repetir_correo== "S";
        this.llamada1rep = registro[0].repetir_llamada== "S";
        this.mmcall1rep = registro[0].repetir_mmcall== "S";
        
        this.miRepetirEs1 = registro[0].escalar1;
        this.tiempoesc1 = registro[0].tiempo1;
        this.logesc1 = registro[0].log1== "S";
        this.smsesc1 = registro[0].sms1== "S";
        this.correoesc1 = registro[0].correo1== "S";
        this.llamadaesc1 = registro[0].llamada1== "S";
        this.mmcallesc1 = registro[0].mmcall1== "S";
        this.repetir1 = registro[0].repetir1== "S";
        this.miLista1 = registro[0].lista1;

        this.miRepetirEs2 = registro[0].escalar2;
        this.tiempoesc2 = registro[0].tiempo2;
        this.logesc2 = registro[0].log2== "S";
        this.smsesc2 = registro[0].sms2== "S";
        this.correoesc2 = registro[0].correo2== "S";
        this.llamadaesc2 = registro[0].llamada2== "S";
        this.mmcallesc2 = registro[0].mmcall2== "S";
        this.repetir2 = registro[0].repetir2== "S";
        this.miLista2 = registro[0].lista2;

        this.miRepetirEs3 = registro[0].escalar3;
        this.tiempoesc3 = registro[0].tiempo3;
        this.logesc3 = registro[0].log3== "S";
        this.smsesc3 = registro[0].sms3== "S";
        this.correoesc3 = registro[0].correo3== "S";
        this.llamadaesc3 = registro[0].llamada3== "S";
        this.mmcallesc3 = registro[0].mmcall3== "S";
        this.repetir3 = registro[0].repetir3== "S";
        this.miLista3 = registro[0].lista3;

        this.miRepetirEs4 = registro[0].escalar4;
        this.tiempoesc4 = registro[0].tiempo4;
        this.logesc4 = registro[0].log4== "S";
        this.smsesc4 = registro[0].sms4== "S";
        this.correoesc4 = registro[0].correo4== "S";
        this.llamadaesc4 = registro[0].llamada4== "S";
        this.mmcallesc4 = registro[0].mmcall4== "S";
        this.repetir4 = registro[0].repetir4== "S";
        this.miLista4 = registro[0].lista4;

        this.miRepetirEs5 = registro[0].escalar5;
        this.tiempoesc5 = registro[0].tiempo5;
        this.logesc5 = registro[0].log5== "S";
        this.smsesc5 = registro[0].sms5== "S";
        this.correoesc5 = registro[0].correo5== "S";
        this.llamadaesc5 = registro[0].llamada5== "S";
        this.mmcallesc5 = registro[0].mmcall5== "S";
        this.repetir5 = registro[0].repetir5== "S";
        this.miLista5 = registro[0].lista5;

        this.escape_llamadas = registro[0].escape_veces;
        this.miEscape = registro[0].escape_accion;
        this.mensajeEsc = registro[0].escape_mensaje;
        this.miListaE = registro[0].escape_lista;

        this.uCreacion = registro[0].creador;
        this.uCambio = registro[0].modificador;
  
        this.fCreacion = new Date(registro[0].creacion);
        this.fCambio = new Date(registro[0].modificacion);

        this.miTipo = registro[0].tipo;
        this.encontrado = true;
        this.accionado = false;

        this.calculoSeg(2);
        this.calculoSeg(3);
        this.calculoSeg(4);
        this.calculoSeg(5);
        this.calculoSeg(6);
        this.calculoSeg(7);

        this.listaFallas.data = [];
        let consulta = "SELECT CASE WHEN comparacion = 1 THEN 'Igual a' WHEN comparacion = 2 THEN 'Diferente a' WHEN comparacion = 3 THEN 'Que empiece con' WHEN comparacion = 4 THEN 'Que no empiece con' WHEN comparacion = 5 THEN 'Que contenga' WHEN comparacion = 6 THEN 'Que no contenga' WHEN comparacion = 7 THEN 'Que termine en' WHEN comparacion = 8 THEN 'Que no termine en' WHEN comparacion = 9 THEN 'Mayor que' WHEN comparacion = 10 THEN 'Mayor o igual que' WHEN comparacion = 11 THEN 'Menor que' WHEN comparacion = 12 THEN 'Menor o igual que' END AS comparacion, prefijo, estacion, IF(estatus = 'A', 'Activo', 'Inactivo') AS estatus, IF(estatus = 'A', 'error_azul', 'aceptar') AS iconos FROM sigma.vw_alerta_fallas WHERE alerta = " + this.datos.id + " ORDER BY orden";
        let campos = {accion: 100, consulta: consulta};  
        this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
          if (datos)
          {
            this.listaFallas.data = datos;
          }
        })
      }
    })  
  }


  cambiando(event: any)
  {
    this.textoSalir = "Cancelar";
    this.accionado = true;
  }

  nuevo()
  {
    if (this.accionado)
    {
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '480px', height: '250px', data: { titulo: "Los cambios actuales se perderán", mensaje: "El registro actual no se ha guardado. ¿Desea cancelar los cambios e iniciar un nuevo registro?", alto: "80", id: 0, accion: 0, botones: 2, boton1STR: "Si, deseo crear un nuevo registro", boton2STR: "Cancelar", icono: "pregunta" }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {
          this.inicializar();
        }
      })
    }
    else
    {
      this.inicializar();
    }
  }

  inicializar()
  {
    this.listaFallas.data = [];
    this.registroActual = " (nuevo)";
    this.miLista0 = 0;
    this.miLista1 = 0;
    this.miLista2 = 0;
    this.miLista3 = 0;
    this.miLista4 = 0;
    this.miLista5 = 0;
    this.miListaE = 0;
    this.nombre = "";
    this.notas = "";
    this.referencia = "";
    this.miTipo = "1";
    this.miPrioridad = "3";
    this.tFallas = 0;
    this.miAcumular = "N";
    this.veces = 0;          
    this.tiempo = 0;
    this.reiniciar  = false;
    this.miMensaje = "";
    this.personalizado = "";
    this.log1 = true;
    this.sms1 = false;
    this.llamada1 = false;
    this.correo1 = false;
    this.mmcall1 = false;

    this.log1rep = true;
    this.sms1rep = false;
    this.llamada1rep = false;
    this.correo1rep = false;
    this.mmcall1rep = false;

    this.logesc1 = true;
    this.smsesc1 = false;
    this.llamadaesc1 = false;
    this.correoesc1 = false;
    this.mmcallesc1 = false;
    this.repetir1 = false;

    this.logesc2 = true;
    this.smsesc2 = false;
    this.llamadaesc2 = false;
    this.correoesc2 = false;
    this.mmcallesc2 = false;
    this.repetir2 = false;

    this.logesc3 = true;
    this.smsesc3 = false;
    this.llamadaesc3 = false;
    this.correoesc3 = false;
    this.mmcallesc3 = false;
    this.repetir3 = false;

    this.logesc4 = true;
    this.smsesc4 = false;
    this.llamadaesc4 = false;
    this.correoesc4 = false;
    this.mmcallesc4 = false;
    this.repetir4 = false;

    this.logesc5 = true;
    this.smsesc5 = false;
    this.llamadaesc5 = false;
    this.correoesc5 = false;
    this.mmcallesc5 = false;
    this.repetir5 = false;

    this.tiemporep = 0;
    this.segundosrepHR = "0.00hr";
    this.tiempoesc1 = 0;
    this.segundosesc1HR = "0.00hr";
    this.tiempoesc2 = 0;
    this.segundosesc2HR = "0.00hr";
    this.tiempoesc3 = 0;
    this.segundosesc3HR = "0.00hr";
    this.tiempoesc4 = 0;
    this.segundosesc4HR = "0.00hr";
    this.tiempoesc5 = 0;
    this.segundosesc5HR = "0.00hr";

    this.acumular_separado = false;
    this.escape_llamadas = "3";
    this.miEscape = "N";
    this.mensajeEsc = ""

    this.estatus = true;
    this.solapar = false;
    this.informar = true;
    this.estatusAntes = true;
    this.encontrado = false;
    this.miComparacion= "1"
    this.cadenaComp = ""
    this.miEstacion = "(Cualquiera)";
    this.miEstacionEscape = "(Cualquiera)";
    this.miRepetirEs1 = "N";
    this.miRepetirEs2 = "N";
    this.miRepetirEs3 = "N";
    this.miRepetirEs4 = "N";
    this.miRepetirEs5 = "N";

    this.fCreacion = "";
    this.fCambio = "";
    this.uCreacion = "";
    this.uCambio = "";

    this.textoSalir = "Cancelar";
    this.accionado = true;

    this.datos.id = 0;

    setTimeout(() => {
      this.txtR.nativeElement.focus();
    }, 50);
  }

  calculoSeg (tipo: number) {
    if (tipo==2)
    {
      this.segundosrepHR = (this.tiemporep / 3600).toFixed(2) + "hr"
    }
    else if (tipo==3)
    {
      this.segundosesc1HR = (this.tiempoesc1 / 3600).toFixed(2) + "hr"
    }
    else if (tipo==4)
    {
      this.segundosesc2HR = (this.tiempoesc2 / 3600).toFixed(2) + "hr"
    }
    else if (tipo==5)
    {
      this.segundosesc3HR = (this.tiempoesc3 / 3600).toFixed(2) + "hr"
    }
    else if (tipo==6)
    {
      this.segundosesc4HR = (this.tiempoesc4 / 3600).toFixed(2) + "hr"
    }
    else if (tipo==7)
    {
      this.segundosesc5HR = (this.tiempoesc5 / 3600).toFixed(2) + "hr"
    }
  }

validar()
  {
    this.validado = true;
    if (!this.nombre)
    {
      setTimeout(() => {
        this.txtR.nativeElement.focus();
      }, 50);
      this.validado = false;
      return;
    }
    if (this.miTipo=="1")
    {
      let datosTabla = [];
      datosTabla = this.listaFallas.data;
      let noHay:boolean = false;
      if (datosTabla.length == 0)
      {
        noHay = true;
      }
      else
      {
        noHay = true;
        datosTabla.forEach((elemento, index) => {          
          if (elemento.estatus == 'Activo')
          {
            noHay = false;
          }
        })
      }
      if (noHay)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe haber al menos un comodín de falla activo", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.txtCadenaComp.nativeElement.focus();
            }, 50);
            
          }
        })
        return;
      }
    }
    if (this.miAcumular == "S")
    {
      if (!this.veces || this.veces==0 || this.veces > 999999)
      {
        setTimeout(() => {
          this.txtHits.nativeElement.focus();
        }, 50);    
        this.validado = false;
        return;    
      }
      //if (!this.tiempo || this.tiempo==0 || this.tiempo > 99999999)
      //{
      //  setTimeout(() => {
      //    this.txtTiempo.nativeElement.focus();
      //  }, 50);
      //  this.validado = false;
      //  return;
      //}
      if (this.miMensaje == "P" && !this.personalizado)
      {
        this.Requerido01 = true;
        setTimeout(() => {
          this.mPersonalizado.nativeElement.focus();
        }, 50);
        this.validado = false;
        return;        
      }
    }
    if (!this.log1 && !this.sms1 && !this.llamada1 && !this.correo1 && !this.mmcall1)
    {
      this.validado = false;
      //No se seleccionó nada
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "La alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {
          setTimeout(() => {
            this.chkLog1.focus();
          }, 50);
        }
      })
      return;
    }
    if ((this.sms1 || this.llamada1 || this.correo1 || this.mmcall1) && !+this.miLista0)
    {
      this.validado = false;
      //No se seleccionó nada
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {
          setTimeout(() => {
            this.lista0.focus();
          }, 50);
          
        }
      })
      return;      
    }

    if (this.miRepetir != "N")
    {
      if (!this.tiemporep || this.tiemporep == 0 || this.tiemporep > 99999999)
      {
        this.validado = false;
        setTimeout(() => {
          this.txtTiemporep.nativeElement.focus();
        }, 50);
        return;
      }
      if (!this.log1rep && !this.sms1rep && !this.llamada1rep && !this.correo1rep && !this.mmcall1rep)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "La repetición de la alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.chkLog1rep.focus();
            }, 50);
          }
        })
        return;        
      }
    }

    if (this.miRepetirEs1 != "N")
    {
      if (!this.tiempoesc1 || this.tiempoesc1 == 0 || this.tiempoesc1 > 99999999)
      {
        this.validado = false;
        setTimeout(() => {
          this.txtTiempoesc1.nativeElement.focus();
        }, 50);
        return;
      }
      if (!this.logesc1 && !this.smsesc1 && !this.llamadaesc1 && !this.correoesc1 && !this.mmcallesc1)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "El escalamiento de la alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.chkLogesc1.focus();
            }, 50);
          }
        })
        return; 
      }
      if ((this.smsesc1 || this.llamadaesc1 || this.correoesc1 || this.mmcallesc1) && !+this.miLista1)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.lista1.focus();
            }, 50);
            return;
          }
        })
        return; 
      }
    }

    if (this.miRepetirEs2 != "N" && !this.chkLogesc2.disabled)
    {
      if (!this.tiempoesc2 || this.tiempoesc2 == 0 || this.tiempoesc2 > 99999999)
      {
        this.validado = false;
        setTimeout(() => {
          this.txtTiempoesc2.nativeElement.focus();
        }, 50);
        return;
      }
      if (!this.logesc2 && !this.smsesc2 && !this.llamadaesc2 && !this.correoesc2 && !this.mmcallesc2)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "El escalamiento de la alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.chkLogesc2.focus();
            }, 50);
          }
        })
        return;
      }
      if ((this.smsesc2 || this.llamadaesc2 || this.correoesc2 || this.mmcallesc2) && !+this.miLista2)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.lista2.focus();
            }, 50);
          }
        })
        return; 
      }
    }

    if (this.miRepetirEs3 != "N" && !this.chkLogesc3.disabled)
    {
      if (!this.tiempoesc3 || this.tiempoesc3 == 0 || this.tiempoesc3 > 99999999)
      {
        this.validado = false;
        setTimeout(() => {
          this.txtTiempoesc3.nativeElement.focus();
        }, 50);
        return;
      }
      if (!this.logesc3 && !this.smsesc3 && !this.llamadaesc3 && !this.correoesc3 && !this.mmcallesc3)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "El escalamiento de la alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.chkLogesc3.focus();
            }, 50);
          }
        })
        return;
        
      }
      if ((this.smsesc3 || this.llamadaesc3 || this.correoesc3 || this.mmcallesc3) && !+this.miLista3)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.lista3.focus();
            }, 50);
          }
        })
        return;
        
      }
    }

    if (this.miRepetirEs4 != "N" && !this.chkLogesc4.disabled)
    {
      if (!this.tiempoesc4 || this.tiempoesc4 == 0 || this.tiempoesc4 > 99999999)
      {
        this.validado = false;
        setTimeout(() => {
          this.txtTiempoesc4.nativeElement.focus();
        }, 50);
        return;
      }
      if (!this.logesc4 && !this.smsesc4 && !this.llamadaesc4 && !this.correoesc4 && !this.mmcallesc4)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "El escalamiento de la alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.chkLogesc4.focus();
            }, 50);
          }
        })
        return;
        
      }
      if ((this.smsesc4 || this.llamadaesc4 || this.correoesc4 || this.mmcallesc4) && !+this.miLista4)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.lista4.focus();
            }, 50);
          }
        })
        return;

      }
    }

    if (this.miRepetirEs5 != "N" && !this.chkLogesc5.disabled)
    {
      if (!this.tiempoesc5 || this.tiempoesc5 == 0 || this.tiempoesc5 > 99999999)
      {
        this.validado = false;
        setTimeout(() => {
          this.txtTiempoesc5.nativeElement.focus();
        }, 50);
        return;
      }
      if (!this.logesc5 && !this.smsesc5 && !this.llamadaesc5 && !this.correoesc5 && !this.mmcallesc5)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "El escalamiento de la alerta debe tener al menos una salida (alarma)", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.chkLogesc5.focus();
            }, 50);
            return;
          }
        })
        
      }
      if ((this.smsesc5 || this.llamadaesc5 || this.correoesc5 || this.mmcallesc5) && !+this.miLista5)
      {
        this.validado = false;
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            setTimeout(() => {
              this.lista5.focus();
            }, 50);
          }
        })
        return;
      }
    }
    if (this.miEscape != "N" && this.miEscape != "L")
      {
        if (!this.mensajeEsc)
        {
          this.validado = false;
          setTimeout(() => {
            this.txtME.nativeElement.focus();
          }, 50);
          return;
        }
        if (!+this.miListaE)
        {
          this.validado = false;
          const dialogRef = this.dialog.open(GeneralComponent, {
            width: '400px', height: '220px', data: { titulo: "El registro no se puede guardar", mensaje: "Debe seleccionar un recipiente", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result.accion == 1) 
            {
              setTimeout(() => {
                this.listaE.focus();
              }, 50);
            }
          })
          return;

        }
      }
      if (this.validado)
      {
        this.guardar();
      }

  }

guardar()
{
  let campos = {accion: 1000, 
    id: this.datos.id, 
    nombre: this.nombre, 
    referencia: this.referencia, 
    notas: this.notas, 
    estatus: (this.estatus ? "A": "I"), 
    solapar: (this.solapar ? "S": "N"), 
    informar: (this.informar ? "S": "N"), 
    miPrioridad: this.miPrioridad, 
    miAcumular: this.miAcumular, 
    veces: this.veces, 
    reiniciar: (this.reiniciar ? "S": "N"),
    tiempo: this.tiempo, 
    miMensaje: this.miMensaje, 
    personalizado: this.personalizado, 
    log1: (this.log1 ? "S": "N"), 
    sms1: (this.sms1 ? "S": "N"),  
    llamada1: (this.llamada1 ? "S": "N"),  
    correo1: (this.correo1 ? "S": "N"), 
    mmcall1: (this.mmcall1 ? "S": "N"), 
    miLista0: this.miLista0, 
    miRepetir: this.miRepetir, 
    tiemporep: this.tiemporep, 
    log1rep: (this.log1rep  ? "S": "N"), 
    sms1rep: (this.sms1rep ? "S": "N"), 
    correo1rep: (this.correo1rep ? "S": "N"),
    llamada1rep: (this.llamada1rep ? "S": "N"), 
    mmcall1rep: (this.mmcall1rep ?   "S": "N"), 
    miRepetirEs1: this.miRepetirEs1, 
    tiempoesc1: this.tiempoesc1, 
    logesc1: (this.logesc1 ? "S": "N"), 
    smsesc1: (this.smsesc1 ? "S": "N"), 
    correoesc1: (this.correoesc1 ? "S": "N"), 
    llamadaesc1: (this.llamadaesc1 ? "S": "N"), 
    mmcallesc1: (this.mmcallesc1 ? "S": "N"), 
    repetir1: (this.repetir1 ? "S": "N"), 
    miLista1: this.miLista1, 
    
    miRepetirEs2: this.miRepetirEs2, 
    tiempoesc2: this.tiempoesc2, 
    logesc2: (this.logesc2 ? "S": "N"), 
    smsesc2: (this.smsesc2 ? "S": "N"), 
    correoesc2: (this.correoesc2 ? "S": "N"), 
    llamadaesc2: (this.llamadaesc2 ? "S": "N"), 
    mmcallesc2: (this.mmcallesc2? "S": "N"),
    repetir2: (this.repetir2 ? "S": "N"), 
    miLista2: this.miLista2, 
    
    miRepetirEs3: this.miRepetirEs3, 
    tiempoesc3: this.tiempoesc3, 
    logesc3: (this.logesc3 ? "S": "N"),
    smsesc3: (this.smsesc3 ? "S": "N"),
    correoesc3: (this.correoesc3 ? "S": "N"),
    llamadaesc3: (this.llamadaesc3 ? "S": "N"),
    mmcallesc3: (this.mmcallesc3 ? "S": "N"),
    repetir3: (this.repetir3 ? "S": "N"), 
    miLista3: this.miLista3, 
    
    miRepetirEs4: this.miRepetirEs4, 
    tiempoesc4: this.tiempoesc4, 
    logesc4: (this.logesc4 ? "S": "N"),
    smsesc4: (this.smsesc4 ? "S": "N"), 
    correoesc4: (this.correoesc4 ? "S": "N"),
    llamadaesc4: (this.llamadaesc4 ? "S": "N"),
    mmcallesc4: (this.mmcallesc4 ? "S": "N"),
    repetir4: (this.repetir4 ? "S": "N"), 
    miLista4: this.miLista4, 
    
    miRepetirEs5: this.miRepetirEs5, 
    tiempoesc5: this.tiempoesc5, 
    logesc5: (this.logesc5 ? "S": "N"), 
    smsesc5: (this.smsesc5 ? "S": "N"),
    correoesc5: (this.correoesc5 ? "S": "N"),
    llamadaesc5: (this.llamadaesc5 ? "S": "N"),
    mmcallesc5: (this.mmcallesc5 ? "S": "N"),
    repetir5: (this.repetir5 ? "S": "N"), 
    miLista5: this.miLista5, 
    tipo: this.miTipo, 
    escape_estacion: this.miEstacionEscape, 
    escape_llamadas: this.escape_llamadas, 
    miEscape: this.miEscape, 
    mensajeEsc: this.mensajeEsc, 
    miListaE: this.miListaE, 
    
    usuario: this.servicio.rUsuario().id};
    
  this.servicio.consultasBD(campos).subscribe((datos: string) =>{
    if (datos)
    {
      
      if (datos.substring(0, 1) =="A")
      {
        this.datos.id = +datos.substring(1, 10);
        this.guardarComodin()
        this.registroActual = " (ID: " + this.datos.id + ")"
        this.uCreacion = this.servicio.rUsuario().nombre;
        this.fCreacion = new Date(); 
      }
      this.guardarComodin()
      this.fCambio = new Date();
      this.uCambio = this.servicio.rUsuario().nombre;
      this.textoSalir = "Salir";
      this.accionado = false;
      this.encontrado = true;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "custom-class";
      mensajeCompleto.mensaje = "La alerta se guardó satisfactoriamente";
      mensajeCompleto.tiempo = 3000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
  })


}

agregarFalla()
{
  //let cadWhere: string = " WHERE CODIGO_FALLA";
  let comparativo: string = "";
  if (this.miComparacion == "1")
  {
    comparativo = "Igual a";
    //cadWhere = cadWhere + " = '" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "2")
  { 
    comparativo = "Diferente a";
    //cadWhere = cadWhere + " <> '" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "3")
  { 
    comparativo = "Que empiece con";
    //cadWhere = cadWhere + " LIKE '" + this.cadenaComp + "%' "; 
  }
  else if (this.miComparacion == "4")
  { 
    comparativo = "Que no empiece con";
    //cadWhere = cadWhere + " NOT LIKE '" + this.cadenaComp + "%' "; 
  }
  else if (this.miComparacion == "5")
  { 
    comparativo = "Que contenga";
    //cadWhere = cadWhere + " LIKE '%" + this.cadenaComp + "%' "; 
  }
  else if (this.miComparacion == "6")
  { 
    comparativo = "Que no contenga";
    //cadWhere = cadWhere + " NOT LIKE '%" + this.cadenaComp + "%' "; 
  }
  else if (this.miComparacion == "7")
  { 
    comparativo = "Que termine en";    
    //cadWhere = cadWhere + " LIKE '%" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "8")
  { 
    comparativo = "Que no termine en";
    //cadWhere = cadWhere + " NOT LIKE '%" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "9")
  { 
    comparativo = "Mayor que";
    //cadWhere = cadWhere + " > '" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "10")
  { 
    comparativo = "Mayor o igual que";
    //cadWhere = cadWhere + " >= '" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "11")
  { 
    comparativo = "Menor que";
    //cadWhere = cadWhere + " < '" + this.cadenaComp + "' "; 
  }
  else if (this.miComparacion == "12")
  { 
    comparativo = "Menor o igual que";
    //cadWhere = cadWhere + " <= '" + this.cadenaComp + "' "; 
  }
  this.fallaLista(comparativo)

  //if (this.miEstacion != "(Cualquiera)")
  //{
  //  cadWhere = cadWhere + "AND ESTACION = '" + this.miEstacion + "'"
  //}

  //let consulta = "SELECT count(*) as cuenta FROM infofallas.catalogo " + cadWhere;
  //  let campos = {accion: 100, consulta: consulta};  
  //  this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
  //    if (datos)
  //    {
  //      if (datos[0].cuenta > 0)
  //      { 
  //       this.fallaLista(comparativo)
  //      }
  //      else
  //      {
  //        const dialogRef = this.dialog.open(GeneralComponent, {
  //          width: '480px', height: '250px', data: { titulo: "No existen fallas con estos parámetros", mensaje: "No existen fallas que coincidasn con los parámetros establecidos. ¿Desea agregar el registro de todas maneras?", alto: "80", id: 0, accion: 0, botones: 2, boton1STR: "Si, agregarlo", boton2STR: "Cancelar", icono: "pregunta" }
  //        });
  //        
  //        dialogRef.afterClosed().subscribe(result => {
  //          if (result.accion == 1) 
  //          {
  //            this.fallaLista(comparativo)
  //          }
  //        })
  //      }
  //    }
  //    else
  //    {
  //      const dialogRef = this.dialog.open(GeneralComponent, {
  //        width: '480px', height: '250px', data: { titulo: "No existen fallas con estos parámetros", mensaje: "No existen fallas que coincidasn con los parámetros establecidos. ¿Desea agregar el registro de todas maneras?", alto: "80", id: 0, accion: 0, botones: 2, boton1STR: "Si, agregarlo", boton2STR: "Cancelar", icono: "pregunta" }
  //      });
  //      
  //      dialogRef.afterClosed().subscribe(result => {
  //        if (result.accion == 1) 
  //        {
  //          this.fallaLista(comparativo)
  //        }
  //      })
  //    }
  //  })
}

  fallaLista(comparativo: string)
  {
    let datosTabla = this.listaFallas.data;

    datosTabla.push({comparacion: comparativo, prefijo: this.cadenaComp, estacion: this.miEstacion, estatus: 'Activo', iconos: 'error_azul'}),
    this.listaFallas.data = datosTabla;
    this.cadenaComp = "";
    this.textoSalir = "Cancelar";
    this.accionado = true;
  }
    
    //Validaciones en pantalla
  inactivar(id: number)
  {
    let cadena = "El comodín no estará disponible en el sistema ¿Desea inactivarlo?";
    let boton1 = "Si, inactivarlo";

    let datosTabla = [];
    datosTabla = this.listaFallas.data;

    if (datosTabla[id].estatus =="Inactivo")
    {
      cadena = "El comodín  estará disponible en el sistema ¿Desea reactivarlo?";
      boton1 = "Si, reactivarlo";
    }
    const dialogRef = this.dialog.open(GeneralComponent, {
      width: '480px', height: '250px', data: { titulo: "Activar/inactivar comodín de falla", mensaje: cadena, alto: "80", id: 0, accion: 0, botones: 2, boton1STR: boton1, boton2STR: "Cancelar", icono: "pregunta" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        if (datosTabla[id].estatus == "Inactivo")
        {
          datosTabla[id].estatus = "Activo" 
          datosTabla[id].iconos = "error_azul" 
        }
        else
        {
          datosTabla[id].estatus = "Inactivo"
          datosTabla[id].iconos = "aceptar"
        }
        this.listaFallas.data = datosTabla;
        this.cadenaComp = "";
        this.textoSalir = "Cancelar";
        this.accionado = true;
      }
    })
  }

  eliminar(id: number)
  {
    const dialogRef = this.dialog.open(GeneralComponent, {
      width: '480px', height: '220px', data: { titulo: "Eliminar comodín de falla", mensaje: "¿Desea eliminar el comodín? ", alto: "50", id: 0, accion: 0, botones: 2, boton1STR: "Si, eliminar", boton2STR: "Cancelar", icono: "pregunta" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let datosTabla = [];
        datosTabla = this.listaFallas.data; 
        datosTabla.splice(id, 1);
        this.listaFallas.data = datosTabla;
        this.cadenaComp = "";
        this.textoSalir = "Cancelar";
        this.accionado = true;
      }
    })
  }

  copiar()
  {
    this.datos.id = 0;
    this.registroActual = " (nuevo)"
    this.textoSalir = "Cancelar";
    this.accionado = true;
  }

  eliminarAlerta()
  {
    const dialogRef = this.dialog.open(GeneralComponent, {
      width: '480px', height: '270px', data: { titulo: "Eliminar registro", mensaje: "Esta acción eliminará permanentemente esta alerta y ya no estará disponible en el sistema ¿Desea eliminar la alerta? ", alto: "100", id: 0, accion: 0, botones: 2, boton1STR: "Si, eliminarla", boton2STR: "Cancelar", icono: "pregunta" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let campos = {accion: 1100, id: this.datos.id};  
        this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
          if (datos)
          {
            this.datos.accion = 3;
            this.dialogRef.close(this.datos);
          }
        })
      }
    })
  }

  guardarComodin()
  {
    let campos = {accion: 1200, id: this.datos.id};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      if (datos)
      {
        let datosTabla = [];
        datosTabla = this.listaFallas.data;
        let consulta = "INSERT INTO sigma.vw_alerta_fallas (alerta, orden, comparacion, prefijo, estacion, estatus) VALUES ";
        datosTabla.forEach((elemento, index) => {  
          let comprarar: number = 0;
          if (elemento.comparacion=="Igual a")
          {
            comprarar = 1;
          }
          else if (elemento.comparacion=="Diferente a")
          {
            comprarar = 2;
          }
          else if (elemento.comparacion=="Que empiece con")
          {
            comprarar = 3;
          }
          else if (elemento.comparacion=="'Que no empiece con")
          {
            comprarar = 4;
          }
          else if (elemento.comparacion=="Que contenga")
          {
            comprarar = 5;
          }
          else if (elemento.comparacion=="Que no contenga")
          {
            comprarar = 6;
          }
          else if (elemento.comparacion=="Que termine en")
          {
            comprarar = 7;
          }
          else if (elemento.comparacion=="Que no termine en")
          {
            comprarar = 8;
          }
          else if (elemento.comparacion=="Mayor que")
          {
            comprarar = 9;
          }
          else if (elemento.comparacion=="Mayor o igual que")
          {
            comprarar = 10;
          }
          else if (elemento.comparacion=="Menor que")
          {
            comprarar = 11;
          }
          else if (elemento.comparacion=="Menor o igual que")
          {
            comprarar = 12;
          }
            consulta = consulta + " (" + this.datos.id + ", " + (index + 1) + ", " + comprarar + ", '" + elemento.prefijo + "', '" + elemento.estacion + "', '" + (elemento.estatus == "Activo" ? "A" : "I") + "')";
          if (index < datosTabla.length - 1)
          {
            consulta = consulta + ", ";
          }
        })
        let campos = {accion: 2000, consulta: consulta};  
        this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
        })

      }
    })
  }


}
