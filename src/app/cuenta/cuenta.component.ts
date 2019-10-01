import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatSelect, MatCheckbox } from '@angular/material';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { GeneralComponent } from '../general/general.component';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  validado: boolean = false;
  rValidado: boolean = false;
  validado_BD: boolean = false;
  isHandset: boolean = false;

  registroActual: string = " (nuevo)";
  cadValidacion: string = "El registro no se puede eliminar";
  nombre: string = "";
  para: string = "";
  copia: string = "";
  oculta: string = "";
  titulo: string = "";
  cuerpo: string = "";
  reportes: string = "";
  periodos: string = "";
  nperiodos: string = "";
  frecuencia: string = "";
  fecha: string = "T";
  hora: string = "T";


  reporte01: string = "N";
  periodo01: string = "10";
  tiempo01: number = 1;

  reporte02: string = "N";
  periodo02: string = "10";
  tiempo02: number = 1;

  reporte03: string = "N";
  periodo03: string = "10";
  tiempo03: number = 1;

  reporte04: string = "N";
  periodo04: string = "10";
  tiempo04: number = 1;

  reporte05: string = "N";
  periodo05: string = "10";
  tiempo05: number = 1;


  reporte06: string = "N";
  periodo06: string = "10";
  tiempo06: number = 1;

  reporte07: string = "N";
  periodo07: string = "10";
  tiempo07: number = 1;

  estatus: boolean = true;
  estatusAntes: boolean = true;
  prefijo: string = "";
  imagen: string = "./assets/icons/recipiente.svg";
  textoSalir: string = "Salir";
  accionado: boolean = false;
  encontrado: boolean = false;
  
  uCreacion: string = "";
  uCambio: string = "";

  fCreacion: any = "";
  fCambio: any = "";

  
  @ViewChild("txtR", { static: true }) txtNombre: ElementRef;
  @ViewChild("txtMail", { static: true }) txtMail: ElementRef;
  @ViewChild("txtTitulo", { static: true }) txtTitulo: ElementRef;
  @ViewChild("reporte1", { static: true }) reporte1: ElementRef;
  
  
  constructor(
    public dialogRef: MatDialogRef<CuentaComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) 
  { 
  }

  ngOnInit()
   {
    if (this.datos.id != 0)
      {
        this.recuperar();
      }
      this.isHandset = window.innerWidth < 600;
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
    let consulta = "SELECT cat_correos.*, a.nombre AS creador, b.nombre AS modificador FROM sigma.cat_correos LEFT JOIN cat_usuarios AS a ON cat_correos.creado = a.id LEFT JOIN cat_usuarios AS b ON cat_correos.modificado = b.id WHERE cat_correos.id = " + this.datos.id;
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.registroActual = " (ID: " + this.datos.id + ")"
        this.nombre = registro[0].nombre;
        this.para = registro[0].para;
        this.copia = registro[0].copia;
        this.oculta = registro[0].oculta;
        this.titulo = registro[0].titulo;
        this.cuerpo = registro[0].cuerpo;
        this.reportes = registro[0].reportes;
        this.periodos = registro[0].periodos;
        this.nperiodos = registro[0].nperiodos;
        this.frecuencia = registro[0].frecuencia;
        if (!this.frecuencia)
        {
          this.frecuencia = "T;T";
        }

        if (this.reportes)
        {
          let mReportes = this.reportes.split(";");
          this.reporte01 = mReportes[0];
          this.reporte02 = mReportes[1];
          this.reporte03 = mReportes[2];
          this.reporte04 = mReportes[3];
          this.reporte05 = mReportes[4];
          this.reporte06 = mReportes[5];
          this.reporte07 = mReportes[6];
        }
        if (this.periodos)
        {
          let mPeriodos = this.periodos.split(";");
          this.periodo01 = mPeriodos[0];
          this.periodo02 = mPeriodos[1];
          this.periodo03 = mPeriodos[2];
          this.periodo04 = mPeriodos[3];
          this.periodo05 = mPeriodos[4];
          this.periodo06 = mPeriodos[5];
          this.periodo07 = mPeriodos[6];
        }
        if (this.nperiodos)
        {
          let mNperiodos = this.nperiodos.split(";");
          this.tiempo01 = +mNperiodos[0];
          this.tiempo02 = +mNperiodos[1];
          this.tiempo03 = +mNperiodos[2];
          this.tiempo04 = +mNperiodos[3];
          this.tiempo05 = +mNperiodos[4];
          this.tiempo06 = +mNperiodos[5];
          this.tiempo07 = +mNperiodos[6];
        }
        if (this.frecuencia)
        {
          let fechayhora = this.frecuencia.split(";");
          this.fecha = fechayhora[0];
          this.hora = fechayhora[1];
        }

        this.estatus = (registro[0].estatus =="A" ? true : false);
        this.estatusAntes = this.estatus;
        this.uCreacion = registro[0].creador;
        this.uCambio = registro[0].modificador;
  
        this.fCreacion = new Date(registro[0].creacion);
        this.fCambio = new Date(registro[0].modificacion);

        this.encontrado = true;
        this.accionado = false;

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
    this.registroActual = " (nuevo)";
    this.nombre = "";
    this.para = "";
    this.copia = "";
    this.oculta = "";
    this.titulo = "";
    this.cuerpo = "";
    this.reportes = "";
    this.periodos = "";
    this.nperiodos = "";

    this.reporte01 = "N";
    this.periodo01 = "10";
    this.tiempo01 = 1;
  
    this.reporte02 = "N";
    this.periodo02 = "10";
    this.tiempo02 = 1;
  
    this.reporte03 = "N";
    this.periodo03 = "10";
    this.tiempo03 = 1;
  
    this.reporte04 = "N";
    this.periodo04 = "10";
    this.tiempo04 = 1;
  
    this.reporte05 = "N";
    this.periodo05 = "10";
    this.tiempo05 = 1;
  
    this.reporte06 = "N";
    this.periodo06 = "10";
    this.tiempo06 = 1;

    this.reporte07 = "N";
    this.periodo07 = "10";
    this.tiempo07 = 1;
    
    this.estatus = true;
    this.estatusAntes = true;
    this.encontrado = false;
    this.fCreacion = "";
    this.fCambio = "";
    this.uCreacion = "";
    this.uCambio = "";

    this.textoSalir = "Cancelar";
    this.accionado = true;

    this.datos.id = 0;

    setTimeout(() => {
      this.txtNombre.nativeElement.focus();
    }, 50);
  }

prevalidar()
{

}  

validar()
  {
    this.validado = true;
    if (!this.nombre)
    {
      this.validado = false;
      setTimeout(() => {
        this.txtNombre.nativeElement.focus();
      }, 50);
      
    }

    if (this.validado && !this.titulo)
    {
      this.validado = false;
      setTimeout(() => {
        this.txtTitulo.nativeElement.focus();
      }, 50);
    }
    
    if (this.validado &&  !this.para && !this.copia && !this.oculta)
    {
      this.validado = false;
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '470px', height: '220px', data: { titulo: this.cadValidacion, mensaje: "Este reporte no tiene una cuenta de correos a quien enviar", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
      });
      dialogRef.afterClosed().subscribe(result => {
          setTimeout(() => {
            this.txtMail.nativeElement.focus();
          }, 50);
      })
    }
    else
    {
      if (this.validado)
      {
        this.guardar();
      }
    }

    if (this.validado && (this.reporte01 + this.reporte02 + this.reporte03 + this.reporte04 + this.reporte05 + this.reporte06) =="NNNNNN")
    {
      this.validado = true;
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '470px', height: '220px', data: { titulo: this.cadValidacion, mensaje: "Este reporte no tiene ninguna información a enviar", alto: "50", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
      });
      dialogRef.afterClosed().subscribe(result => {
          setTimeout(() => {
            this.reporte1.nativeElement.focus();
          }, 50);
      })
    }
    if (this.validado)
    {
      this.guardar();
    }
  }

guardar()
{  
  this.reportes = this.reporte01 + ";" + this.reporte02 + ";" + this.reporte03 + ";" + this.reporte04 + ";" + this.reporte05 + ";" + this.reporte06 + ";" + this.reporte07 
  this.periodos = this.periodo01 + ";" + this.periodo02 + ";" + this.periodo03 + ";" + this.periodo04 + ";" + this.periodo05 + ";" + this.periodo06 + ";" + this.periodo07  
  this.nperiodos = this.tiempo01 + ";" + this.tiempo02 + ";" + this.tiempo03 + ";" + this.tiempo04 + ";" + this.tiempo05 + ";" + this.tiempo06 + ";" + this.tiempo07  
  this.frecuencia = this.fecha + ";" + this.hora;
  let campos = {accion: 1020, 
    id: this.datos.id, 
    nombre: this.nombre, 
    para: this.para,
    copia: this.copia,
    oculta: this.oculta,
    titulo: this.titulo,
    cuerpo: this.cuerpo,
    reportes: this.reportes, 
    periodos: this.periodos, 
    nperiodos: this.nperiodos, 
    frecuencia: this.frecuencia, 
    estatus: (this.estatus ? "A": "I"), 
    usuario: this.servicio.rUsuario().id};
    this.servicio.consultasBD(campos).subscribe((datos: string) =>{
    if (datos)
    {
      if (datos.substring(0, 1) =="A")
      {
        this.datos.id = +datos.substring(1, 10);
        this.registroActual = " (ID: " + this.datos.id + ")"
        this.uCreacion = this.servicio.rUsuario().nombre;
        this.fCreacion = new Date(); 
      }
      this.fCambio = new Date();
      this.uCambio = this.servicio.rUsuario().nombre;
      this.textoSalir = "Salir";
      this.accionado = false;
      this.encontrado = true;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "custom-class";
      mensajeCompleto.mensaje = "El reporte se guardó satisfactoriamente";
      mensajeCompleto.tiempo = 3000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
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

  
  eliminar()
  {
    const dialogRef = this.dialog.open(GeneralComponent, {
      width: '480px', height: '270px', data: { titulo: "Eliminar reporte", mensaje: "Esta acción eliminará permanentemente este reporte y ya no se enviará este correo ¿Desea eliminar el reporte? ", alto: "100", id: 0, accion: 0, botones: 2, boton1STR: "Si, eliminarlo", boton2STR: "Cancelar", icono: "pregunta" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {

        let consulta = "DELETE FROM sigma.cat_correos WHERE id = " + this.datos.id;
        let campos = {accion: 2000, consulta: consulta};  
        this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
          this.datos.accion = 3;
            this.dialogRef.close(this.datos);
        })
  

      }
    })
  }
  
}
  

