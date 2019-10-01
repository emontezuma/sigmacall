import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

  @ViewChild("txtC", { static: true }) txtC: ElementRef;
  @ViewChild("txtP", { static: true }) txtP: ElementRef;
  @ViewChild("txtPt", { static: true }) txtPt: ElementRef;
  @ViewChild("txtH", { static: true }) txtH: ElementRef;
  
  correo_cuenta: string = "";
  correo_puerto: string = "";
  correo_clave: string = "";
  correo_host: string = "";
  correo_ssl: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<CorreoComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  recuperar(tipo: number)
  {
    let cadUsuario = " (usuario = " + this.servicio.rUsuario().id + " OR usuario = 0) "
    if (tipo == 1) 
    {
      cadUsuario = " (usuario = 0) ";
    } 
    let consulta = "SELECT * from sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.correo_cuenta = registro[0].correo_cuenta;
        this.correo_puerto = registro[0].correo_puerto; 
        this.correo_clave = registro[0].correo_clave; 
        this.correo_host = registro[0].correo_host; 
        this.correo_ssl = registro[0].correo_ssl == "S"; 
      }
    })  
  }

  ngOnInit() {
    
    this.recuperar(0);
  }


  cancelar()
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  validar()
 {
    if (!this.correo_cuenta) 
    {
      this.txtC.nativeElement.focus();
      return;
    }
    if (!this.correo_clave) 
    {
      this.txtP.nativeElement.focus();
      return;
    }
    if (!this.correo_host) 
    {
      this.txtH.nativeElement.focus();
      return;
    }
    if (!this.correo_puerto) 
    {
      this.txtPt.nativeElement.focus();
      return;
    }

    let consulta = "SELECT COUNT(*) AS cuenta from sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro)
      {
        if (registro[0].cuenta==0)
        {
          //Nuevo registro
          consulta = "INSERT INTO sigma.vw_configuracion (correo_cuenta, correo_puerto, correo_ssl, correo_clave, correo_host) VALUES ('" + this.correo_cuenta + "', '" + this.correo_puerto + "', '" + (this.correo_ssl ? 'S' : 'N') + "', '" + this.correo_clave + "', '" + this.correo_host + "')";
        }
        else
        {
          consulta = "UPDATE sigma.vw_configuracion SET correo_cuenta = '" + this.correo_cuenta  + "', correo_puerto = '" + this.correo_puerto + "', correo_ssl = '" + (this.correo_ssl ? 'S' : 'N') + "', correo_clave = '" + this.correo_clave + "', correo_host = '" + this.correo_host + "'";
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
