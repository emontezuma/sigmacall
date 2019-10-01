import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { GeneralComponent } from '../general/general.component';
import { CambioComponent } from '../cambio/cambio.component';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  @ViewChild("txtID", { static: true }) txtID: ElementRef;
  @ViewChild("txtClave", { static: true }) txtClave: ElementRef;
  
  referencia: string = "";
  clave: string = "";
  logoAplicacion: string = "./assets/icons/logoapp.png";
  
  constructor(
    public dialogRef: MatDialogRef<IngresoComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  ngOnInit() {
    
  }


  cancelar()
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  validar()
 {
    if (!this.referencia) 
    {
      this.txtID.nativeElement.focus();
      return;
    }
    else
    {
      let consulta = "SELECT * from sigma.cat_usuarios WHERE referencia = '" + this.referencia + "' AND inicializada = 'S' AND estatus = 'A'"; 
      let campos = {accion: 100, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
        if (registro)
        {
          if (registro.length == 0)
          {
            //Nuevo registro
            this.pedirClave();
          }
          else
          {
            this.servicio.aCambioClave(false);
            const dialogRef = this.dialog.open(CambioComponent, {
              width: '370px', height: '420px', data: { id: 0, accion: 0, idUT: registro[0].id }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result.accion == 1) {
                //Se cancela la llamada
                this.servicio.aUsuario({id: registro[0].id, nombre: registro[0].nombre, referencia: registro[0].referencia, rol: registro[0].rol, politica: registro[0].politica, admin: (registro[0].admin == "S" ? true : false), vista_resumida_fallas: (registro[0].vista_resumida_fallas == "S" ? true : false), upantalla: +registro[0].ultima_pantalla })
                this.datos.accion=1; 
                this.servicio.iniUsuario.emit(true);
                this.dialogRef.close(this.datos);
              }
            });
          }
        }
      })
    }
  }

pedirClave()
{
  if (!this.clave ) 
  {
    this.txtClave.nativeElement.focus();
    return;
  }
  else
  {
    let consulta = "SELECT * from sigma.cat_usuarios WHERE referencia = '" + this.referencia + "' AND clave = '" + this.clave + "' AND estatus = 'A'"; 
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro)
      {
        if (registro.length == 0)
        {
          //Nuevo registro
          const dialogRef = this.dialog.open(GeneralComponent, {
            width: '480px', height: '250px', data: { titulo: "Acceso denegado", mensaje: "El usuario o la contraseña no están registradas en la aplicación. Comuníquese con el adminitrador del sistema", alto: "70", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
          });
        }
        else
        {
          this.servicio.aUsuario({id: registro[0].id, nombre: registro[0].nombre, referencia: registro[0].referencia, rol: registro[0].rol, politica: registro[0].politica, admin: (registro[0].admin == "S" ? true : false), vista_resumida_fallas: (registro[0].vista_resumida_fallas == "S" ? true : false), upantalla: +registro[0].ultima_pantalla })
          this.datos.accion=1; 
          this.servicio.iniUsuario.emit(true);
          this.dialogRef.close(this.datos);
        }
      }
      else
      {
        const dialogRef = this.dialog.open(GeneralComponent, {
          width: '480px', height: '250px', data: { titulo: "Acceso denegado", mensaje: "El usuario o la contraseña no están registradas en la aplicación. Comuníquese con el adminitrador del sistema", alto: "70", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono: "error_azul" }
        });
      }

    }) 
  }
}

 
}








