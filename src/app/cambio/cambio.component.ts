import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-cambio',
  templateUrl: './cambio.component.html',
  styleUrls: ['./cambio.component.css']
})
export class CambioComponent implements OnInit {

  @ViewChild("txtActual", { static: true }) txtActual: ElementRef;
  @ViewChild("txtNueva", { static: true }) txtNueva: ElementRef;
  @ViewChild("txtConfirmacion", { static: true }) txtConfirmacion: ElementRef;
  
  clave_actual: string = "";
  nueva_clave: string = "";
  confirmacion: string = "";
  cambiando: boolean = this.servicio.rCambioClave();
  errorPassword: string = "Campo requerido";
  errorPassword2: string = "Campo requerido";
  vermiClave = [false, false, false];
  imagenVer = ["verClave", "verClave", "verClave"] 

  constructor(
    public dialogRef: MatDialogRef<CambioComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  ngOnInit()
  {
  }

  cancelar()
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  validar()
 {
    if (!this.clave_actual && this.cambiando) 
    {
      this.txtActual.nativeElement.focus();
      return;
    }
    if (!this.nueva_clave) 
    {
      this.txtNueva.nativeElement.focus();
      this.errorPassword = "Campo requerido";
      return;
    }
    if (!this.confirmacion) 
    {
      this.txtConfirmacion.nativeElement.focus();
      return;
    }
    if (this.nueva_clave!=this.confirmacion) 
    {
      this.txtNueva.nativeElement.focus();
      this.errorPassword = "Contraseña no confirmada";
      return;
    }
    if (this.cambiando)
    {
      let consulta = "SELECT COUNT(*) as cuenta FROM sigma.cat_usuarios WHERE clave = '" + this.clave_actual + "'";
      let campos = {accion: 100, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
        if (datos && datos.length > 0)
        {
          if (datos[0].cuenta == 0)
          {
            this.errorPassword2 = "La contraseña no coincide";
            this.txtActual.nativeElement.focus();
            return;
          }
          else
          {
            this.actualizarClave();        
          }
        }
        else
        {
          this.errorPassword2 = "La contraseña no coincide";
          this.txtActual.nativeElement.focus();
          return;
        }
      })
    }
    else
    {
      this.actualizarClave();
    }
  }

  actualizarClave()
  {
    let consulta = "UPDATE sigma.cat_usuarios SET clave = '" + this.nueva_clave  + "', inicializada = 'N' WHERE id = " + this.datos.idUT;
    let campos = {accion: 2000, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
        this.datos.accion = 1;
        this.dialogRef.close(this.datos);
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "custom-class";
        mensajeCompleto.mensaje = "La contraseña se ha establecido satisfactoriamente";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.servicio.llenarAreas.emit(true);
      })
    }
    
    verClave(indice: number) {
      this.vermiClave[indice] = !this.vermiClave[indice];
      this.imagenVer[indice] = (this.imagenVer[indice] == "verClave" ? "verClave2" : "verClave");
    }
    
}
