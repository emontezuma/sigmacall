import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatSelect, MatCheckbox } from '@angular/material';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { GeneralComponent } from '../general/general.component';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  validado: boolean = false;
  rValidado: boolean = false;
  validado_BD: boolean = false;
  isHandset: boolean = false;

  registroActual: string = " (nuevo)";
  cadValidacion: string = "El registro no se puede eliminar";
  nombre: string = "";
  referencia: string = "";
  rol: string = "C";
  cerrar_al_ejecutar: boolean = false;
  admin: boolean = false;
  vista_resumida_fallas: boolean = false;

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

  
  @ViewChild("txtID", { static: true }) txtID: ElementRef;
  @ViewChild("txtNombre", { static: true }) txtNombre: ElementRef;
  
  
  constructor(
    public dialogRef: MatDialogRef<UsuarioComponent>, 
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
        setTimeout(() => {
          this.recuperar();  
        }, 300);
        
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
    let consulta = "SELECT cat_usuarios.*, a.nombre AS creador, b.nombre AS modificador FROM sigma.cat_usuarios LEFT JOIN cat_usuarios AS a ON cat_usuarios.creado = a.id LEFT JOIN cat_usuarios AS b ON cat_usuarios.modificado = b.id WHERE cat_usuarios.id = " + this.datos.id;
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.registroActual = " (ID: " + this.datos.id + ")"
        this.referencia = registro[0].referencia;
        this.nombre = registro[0].nombre;
        this.admin = (registro[0].admin =="S" ? true : false);
        this.rol = registro[0].rol;
        this.cerrar_al_ejecutar = (registro[0].cerrar_al_ejecutar =="S" ? true : false);
        this.vista_resumida_fallas = (registro[0].vista_resumida_fallas =="S" ? true : false);
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
    this.rol = "C";
    this.admin = false;
    this.cerrar_al_ejecutar = false;
    this.vista_resumida_fallas = false;

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
    if (!this.referencia)
    {
      this.validado = false;
      setTimeout(() => {
        this.txtID.nativeElement.focus();
      }, 50);
      
    }
    if (!this.nombre)
    {
      this.validado = false;
      setTimeout(() => {
        this.txtNombre.nativeElement.focus();
      }, 50);
      
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
  if (this.admin)
  {
    this.rol = "A";
    this.estatus = true;
  }
  let campos = {accion: 1030, 
    id: this.datos.id, 
    nombre: this.nombre, 
    referencia: this.referencia,
    rol: this.rol,
    cerrar_al_ejecutar: (this.cerrar_al_ejecutar ? "S" : "N"),
    vista_resumida_fallas: (this.vista_resumida_fallas ? "S" : "N"),
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
      mensajeCompleto.mensaje = "El usuario se guardó satisfactoriamente";
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
    this.referencia = "";
    this.txtID.nativeElement.focus();
  }

  
  eliminar()
  {
    if (this.admin)
    {
      const dialogRef = this.dialog.open(GeneralComponent, {
        width: '480px', height: '250px', data: { titulo: "Este usuario no se puede eliminar", mensaje: "El usuario ADMIN no se puede eliminar, si presenta problemas, cambie su contraseña", alto: "70", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
      });
    }
    else
    {
        const dialogRef = this.dialog.open(GeneralComponent, {
        width: '480px', height: '270px', data: { titulo: "Eliminar usuario", mensaje: "Esta acción eliminará permanentemente este usuario y ya no se podrá acceder al sistema ¿Desea eliminar el usuario? ", alto: "100", id: 0, accion: 0, botones: 2, boton1STR: "Si, eliminarlo", boton2STR: "Cancelar", icono: "pregunta" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {

          let consulta = "DELETE FROM sigma.cat_usuarios WHERE id = " + this.datos.id;
          let campos = {accion: 2000, consulta: consulta};  
          this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
            this.datos.accion = 3;
              this.dialogRef.close(this.datos);
          })
        }
      })
    }
  }

  iniClave()
  {
      const dialogRef = this.dialog.open(GeneralComponent, {
      width: '480px', height: '270px', data: { titulo: "Inicializar contraseña de usuario", mensaje: "Esta acción inicializará la contraseña de este usuario y pedirá cambio de la misma en el próximo inicio de sesión ¿Desea contnuar? ", alto: "100", id: 0, accion: 0, botones: 2, boton1STR: "Si, inicializar", boton2STR: "Cancelar", icono: "pregunta" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let consulta = "UPDATE sigma.cat_usuarios SET inicializada = 'S' WHERE id = " + this.datos.id;
        
        let campos = {accion: 2000, consulta: consulta};  
        this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
          this.datos.accion = 3;
            this.dialogRef.close(this.datos);
        })
      }
    })
  }
  
}
  

