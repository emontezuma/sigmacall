import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatSelect, MatCheckbox } from '@angular/material';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { GeneralComponent } from '../general/general.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  validado: boolean = false;
  rValidado: boolean = false;
  validado_BD: boolean = false;
  isHandset: boolean = false;

  registroActual: string = " (nuevo)";
  cadValidacion: string = "El registro no se puede eliminar";
  nombre: string = "";
  telefonos: string = "";
  correos: string = "";
  mmcall: string = "";
  estatus: boolean = true;
  estatusAntes: boolean = true;
  prefijo: string = "";
  referencia: string = "";
  imagen: string = "./assets/icons/recipiente.svg";
  textoSalir: string = "Salir";
  accionado: boolean = false;
  encontrado: boolean = false;
  ayuda01: string = "Coloque el prefijo D y luego el ID de la división si desea enviar el mensaje a todos los relojes de una misma división. Coloque el ID de un staff (sin prefijo) si sólo desea enviarlo a un sólo reloj";
  
  uCreacion: string = "";
  uCambio: string = "";

  fCreacion: any = "";
  fCambio: any = "";

  
  @ViewChild("txtR", { static: true }) txtNombre: ElementRef;
  @ViewChild("txtTelefonos", { static: true }) txtTelefonos: ElementRef;
  
  constructor(
    public dialogRef: MatDialogRef<ListaComponent>, 
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
    let consulta = "SELECT cat_distribucion.*, a.nombre AS creador, b.nombre AS modificador FROM sigma.cat_distribucion LEFT JOIN cat_usuarios AS a ON cat_distribucion.creado = a.id LEFT JOIN cat_usuarios AS b ON cat_distribucion.modificado = b.id WHERE cat_distribucion.id = " + this.datos.id;
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.registroActual = " (ID: " + this.datos.id + ")"
        this.nombre = registro[0].nombre;
        this.referencia = registro[0].referencia;
        this.telefonos = registro[0].telefonos;
        this.correos = registro[0].correos;
        this.mmcall = registro[0].mmcall;
        
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
    this.referencia = "";
    this.telefonos = "";
    this.correos = "";
    this.mmcall = "";
    
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
      setTimeout(() => {
        this.txtNombre.nativeElement.focus();
      }, 50);
      this.validado = false;
      return;
    }
    
    if (!this.telefonos && !this.correos && !this.mmcall)
    {
      this.validado = true;
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '470px', height: '300px', data: { titulo: "Registro incompleto", mensaje: "El recipiente que desea guardar no tiene número de teléfono, correo ni prefijo o requester de MMCall. Si este recipiente es ocupado por una alerta, no generará notificación alguna. ¿Desea guardarlo de todas maneras?", alto: "130", id: 0, accion: 0, botones: 2, boton1STR: "Si, guardarlo", boton2STR: "Cancelar", icono: "pregunta" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.accion != 1) 
        {
          setTimeout(() => {
            this.txtTelefonos.nativeElement.focus();
          }, 50);
        }
        else
        {
          this.guardar();
        }
      })
    }
    else
    {
      if (this.validado)
      {
        this.guardar();
      }
    }
    

  }

guardar()
{
  if (!this.estatus &&   this.estatusAntes) 
  { 
    this.validacion1(2);
  }
  else
  {
    this.aGuardar()
  }
}

aGuardar()
{  
  let campos = {accion: 1010, 
    id: this.datos.id, 
    nombre: this.nombre, 
    referencia: this.referencia,
    telefonos: this.telefonos,
    correos: this.correos,
    mmcall: this.mmcall, 
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
      mensajeCompleto.mensaje = "El recipiente se guardó satisfactoriamente";
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

  validacion1(desde: number)
  {
    if (desde==1)
    {
      this.cadValidacion = "El registro no se puede eliminar";
    }
    else
    {
      this.cadValidacion = "El registro no se puede inactivar";
    }
    //Validar si esta asignada
    let consulta = "SELECT GROUP_CONCAT(nombre ORDER BY nombre ASC SEPARATOR ', ') as alertas, count(*) as cuenta FROM sigma.vw_alertas WHERE (lista = " + this.datos.id + " OR lista1 = " + this.datos.id + " OR lista2 = " + this.datos.id + " OR lista3 = " + this.datos.id + " OR lista4 = " + this.datos.id + " OR lista5 = " + this.datos.id + ") AND estatus = 'A'";
    let campos = {accion: 100, consulta: consulta};  
    this. servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        if (registro[0].cuenta > 0)
        {
          const dialogRef = this.dialog.open(GeneralComponent, {
            width: '470px', height: '290px', data: { titulo: this.cadValidacion, mensaje: "Existe(n) " + registro[0].cuenta + " alerta(s) asociada(s) a este recipiente. Alerta(s): " + registro[0].alertas + "). Modifique esta(s) alerta(s) y asigne otro recipente e intente de nuevo", alto: "120", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
          });
        }
        else
        {
          this.validacion2(desde);
        }
      }
      else
        {
          this.validacion2(desde);
        }
    })
  };

  validacion2(desde: number)
  {
    //Validar si esta asignada
    let consulta = "SELECT GROUP_CONCAT(id ORDER BY id ASC SEPARATOR ', ') AS reportes, COUNT(*) as cuenta FROM sigma.vw_reportes WHERE (lista = " + this.datos.id + " OR lista1 = " + this.datos.id + " OR lista2 = " + this.datos.id + " OR lista3 = " + this.datos.id + " OR lista4 = " + this.datos.id + " OR lista5 = " + this.datos.id + ") AND estado <> 9";
    let campos = {accion: 100, consulta: consulta};  
    this. servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        if (registro[0].cuenta > 0)
        {
          const dialogRef = this.dialog.open(GeneralComponent, {
            width: '470px', height: '290px', data: { titulo: this.cadValidacion, mensaje: "Existe(n) (" + registro[0].cuenta + ") reporte(s) sin finalizar asociado(s) a este recipiente. El (los) número(s) de reporte es (son): " + registro[0].reportes + ". Debe esperar a que sea(n) atendido(s) o finalizado(s) para proceder", alto: "120", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
          });
        }
        else
        {
          this.validacion3(desde);
        }
      }
      else
        {
          this.validacion3(desde);
        }
    })
  };

  validacion3(desde: number)
  {
    //Validar si esta asignada
    let consulta = "SELECT id FROM sigma.vw_configuracion WHERE escape_lista = " + this.datos.id;
    let campos = {accion: 100, consulta: consulta};  
    this. servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        if (registro[0].id)
        {
          const dialogRef = this.dialog.open(GeneralComponent, {
            width: '470px', height: '240px', data: { titulo: this.cadValidacion, mensaje: "Este recipiente se utiliza como el recipente de escape para las llamadas de voz", alto: "70", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
          });
        }
        else
        {
          this.validacion4(desde);
        }
      }
      else
        {
          this.validacion4(desde);
        }
    })
  }

  validacion4(desde: number)
  {
    //Validar si esta asignada
    let consulta = "SELECT id FROM sigma.vw_configuracion WHERE escape_mmcall_lista = " + this.datos.id;
    let campos = {accion: 100, consulta: consulta};  
    this. servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        if (registro[0].id)
        {
          const dialogRef = this.dialog.open(GeneralComponent, {
            width: '470px', height: '240px', data: { titulo: this.cadValidacion, mensaje: "Este recipiente se utiliza como el recipente de escape para las llamadas a MMCall", alto: "70", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
          });
        }
        else
        {
          if (desde==1)
          {
            this.aEliminar();
          }
          else if (desde==2)
          {
            this.aGuardar();
          }
        }
      }
      else
        {
          if (desde==1)
          {
            this.aEliminar();
          }
          else if (desde==2)
          {
            this.aGuardar();
          }
        }
    })
  }

  aEliminar()
  {
    const dialogRef = this.dialog.open(GeneralComponent, {
      width: '480px', height: '270px', data: { titulo: "Eliminar recipiente", mensaje: "Esta acción eliminará permanentemente este recipiente y ya no estará disponible en el sistema ¿Desea eliminar el recipiente? ", alto: "100", id: 0, accion: 0, botones: 2, boton1STR: "Si, eliminarla", boton2STR: "Cancelar", icono: "pregunta" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let campos = {accion: 1110, id: this.datos.id};  
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
  
}
  

