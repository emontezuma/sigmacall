import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-configvivo',
  templateUrl: './configvivo.component.html',
  styleUrls: ['./configvivo.component.css']
})
export class ConfigvivoComponent implements OnInit {

  
  
  ruta_imagenes: string = "";
  tiempo_imagen: number = 30;
  graficas_seleccion: string = "";
  graficas_duracion: string = "";
  grafica01: string = "N";
  grafica02: string = "N";
  grafica03: string = "N";
  grafica04: string = "N";
  grafica05: string = "N";
  grafica06: string = "N";

  duracion01: number = 30;
  duracion02: number = 30;
  duracion03: number = 30;
  duracion04: number = 30;
  duracion05: number = 30;
  duracion06: number = 30;
  
  constructor(
    public dialogRef: MatDialogRef<ConfigvivoComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  recuperar(tipo: number)
  {
    let consulta = "SELECT * from sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro && registro.length>0)
      {
        this.ruta_imagenes = registro[0].ruta_imagenes;
        this.tiempo_imagen = registro[0].tiempo_imagen; 
        this.graficas_seleccion = registro[0].graficas_seleccion; 
        this.graficas_duracion = registro[0].graficas_duracion; 
        
        if (this.graficas_seleccion)
        {
          let mGraficas = this.graficas_seleccion.split(";");
          this.grafica01 = mGraficas[0];
          this.grafica02 = mGraficas[1];
          this.grafica03 = mGraficas[2];
          this.grafica04 = mGraficas[3];
          this.grafica05 = mGraficas[4];
          this.grafica06 = mGraficas[5];
        }
          if (!this.grafica01)
          {
            this.grafica01 = "N"
          }
          if (!this.grafica02)
          {
            this.grafica02 = "N"
          }
          if (!this.grafica03)
          {
            this.grafica03 = "N"
          }
          if (!this.grafica04)
          {
            this.grafica04 = "N"
          }
          if (!this.grafica05)
          {
            this.grafica05 = "N"
          } 
          if (!this.grafica06)
          {
            this.grafica06 = "N"
          } 
          

        if (this.graficas_duracion)
        {
          let mGraficas = this.graficas_duracion.split(";");
          this.duracion01 = +mGraficas[0];
          this.duracion02 = +mGraficas[1];
          this.duracion03 = +mGraficas[2];
          this.duracion04 = +mGraficas[3];
          this.duracion05 = +mGraficas[4];
          this.duracion06 = +mGraficas[5];
        }
        if (!this.duracion01)
        {
          this.duracion01 = 30;
        }
        if (!this.duracion02)
        {
          this.duracion02 = 30;
        }
        if (!this.duracion03)
        {
          this.duracion03 = 30;
        }
        if (!this.duracion04)
        {
          this.duracion04 = 30;
        }
        if (!this.duracion05)
        {
          this.duracion05 = 30;
        }
        if (!this.duracion06)
        {
          this.duracion06 = 30;
        }
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
    if (+this.duracion01>120)
    {
      this.duracion01 = 120;
    }
    if (+this.duracion02>120)
    {
      this.duracion02 = 120;
    }
    if (+this.duracion03>120)
    {
      this.duracion03 = 120;
    }
    if (+this.duracion04>120)
    {
      this.duracion04 = 120;
    }
    if (+this.duracion05>120)
    {
      this.duracion05 = 120;
    }
    if (+this.duracion06>120)
    {
      this.duracion06 = 120;
    }
    if (+this.tiempo_imagen>120)
    {
      this.tiempo_imagen = 120;
    }

    if (+this.duracion01<10)
    {
      this.duracion01 = 10;
    }
    if (+this.duracion02<10)
    {
      this.duracion02 = 10;
    }
    if (+this.duracion03<10)
    {
      this.duracion03 = 10;
    }
    if (+this.duracion04<10)
    {
      this.duracion04 = 10;
    }
    if (+this.duracion05<10)
    {
      this.duracion05 = 10;
    }
    if (+this.duracion06<10)
    {
      this.duracion06 = 10;
    }
    if (+this.tiempo_imagen<0)
    {
      this.tiempo_imagen = 0;
    }

    let graficas_seleccion = this.grafica01 + ";" + this.grafica02 + ";" + this.grafica03 + ";" + this.grafica04 + ";" + this.grafica05 + ";" + this.grafica06  
    let graficas_duracion = +this.duracion01 + ";" + +this.duracion02 + ";" + +this.duracion03 + ";" + +this.duracion04 + ";" + +this.duracion05 + ";" + +this.duracion06  
    let ruta_imagenes  = this.ruta_imagenes.replace(/\\/g, "\\\\");; 
     let consulta = "SELECT COUNT(*) AS cuenta from sigma.vw_configuracion";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
      if (registro)
      {
        if (registro[0].cuenta==0)
        {
          //Nuevo registro
          consulta = "INSERT INTO sigma.vw_configuracion (ruta_imagenes, tiempo_imagen, graficas_seleccion, graficas_duracion) VALUES ('" + ruta_imagenes + "', " + +this.tiempo_imagen + ", '" + graficas_seleccion + "', '" + graficas_duracion + "')";
        }
        else
        {
          consulta = "UPDATE sigma.vw_configuracion SET ruta_imagenes = '" + ruta_imagenes  + "', tiempo_imagen = " + +this.tiempo_imagen + ", graficas_seleccion = '" + graficas_seleccion + "', graficas_duracion = '" + graficas_duracion + "'";
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
