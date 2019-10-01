import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-grafica-param',
  templateUrl: './grafica-param.component.html',
  styleUrls: ['./grafica-param.component.css']
})

export class GraficaParamComponent implements OnInit {

  fecha1 = new Date();
  fecha2 = new Date();
  habFecha: boolean = true;  
  errorFecha: boolean = true;
  miPeriodo: string = "1";
  mensajeFecha: string = "";
  miEstacion: string = "";
  estaciones = [];

  
  @ViewChild("fechaDesde", { static: true }) txtfechaDesde: ElementRef;
  
  constructor(
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<GraficaParamComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private servicio: ServicioService,
    public dialog: MatDialog,
  ) 
  { 
  
  }

  ngOnInit()
   {
     if (+this.servicio.rPeriodo() > 0)
     {
      this.miPeriodo = '' + this.servicio.rPeriodo()
      if (this.miPeriodo != "1")
      {
        this.calcularFecha(this.miPeriodo)
      }
      else
      {
        this.fecha1 = new Date(this.servicio.rFechaDesde());
        this.fecha2 = new Date(this.servicio.rFechaHasta());
      }
      
     }
      this.poblarEstaciones()
    }

  poblarEstaciones()
  {
  let consulta = "SELECT estacion AS id, estacion AS nombre FROM sigma.vw_alarmas group by estacion";
      let campos = {accion: 100, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
        if (datos)
        {
          this.estaciones = datos;
          this.miEstacion = this.servicio.rEstacion()
        }
      })
    }

  cancelar()
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  cambiarPeriodo(event: any) 
  {
    this.mensajeFecha = "";
    this.fecha1 = new Date();
    this.fecha2 = new Date();
    this.calcularFecha(event.value)
  }

  calcularFecha(periodo: string )
  {
    if (periodo == "1")
    {
      this.servicio.aTextoPer("(" + this.datepipe.transform(this.fecha1, "yyyy/MM/dd") + " - " + this.datepipe.transform(this.fecha2, "yyyy/MM/dd") + ")" );
    }
    else if (periodo == "10")
    {
      this.servicio.aTextoPer("Lo que va del día");
    }
    else if (periodo == "11")
    {
      if (this.fecha1.getDay()==0) 
      {
        //domingo
        this.fecha1.setDate(this.fecha1.getDate() - 6);
      }
      else 
      {
        this.fecha1.setDate(this.fecha1.getDate() - (this.fecha1.getDay() - 1));
      }
      this.servicio.aTextoPer("Lo que va de semana");
    }
    else if (periodo == "12")
    {
      let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
      this.fecha1 = new Date(nuevaFecha);
      this.servicio.aTextoPer("Lo que va de mes");
    }
    else if (periodo == "13")
    {
      let nuevaFecha = this.servicio.fecha(1, '' , "yyyy") + "/01/01";         
      this.fecha1 = new Date(nuevaFecha);
      this.servicio.aTextoPer("Lo que va de año");
    }
    else if (periodo == "20") 
    {
      this.fecha1.setDate(this.fecha1.getDate() - 1);
      this.fecha2 = this.fecha1;
      this.servicio.aTextoPer("El día de ayer");
    }
    else if (periodo == "21") 
    {
      this.fecha1 = new Date();
      if (this.fecha1.getDay() == 0) 
      {
        this.fecha1.setDate(this.fecha1.getDate() - 13);
        this.fecha2.setDate(this.fecha2.getDate() - 7);
        this.servicio.aTextoPer("La semana pasada");
      }
      else 
      {
        this.fecha1.setDate(this.fecha1.getDate() - (this.fecha1.getDay()));
        this.fecha2.setDate(this.fecha2.getDate() - (this.fecha2.getDay() - 1) - 7);
        this.servicio.aTextoPer("La semana pasada");
      }
    }

    else if (periodo == "22") {
      let mesTemp = new Date(this.datepipe.transform(new Date(this.fecha1), "yyyy/MM") + "/01");
      mesTemp.setDate(mesTemp.getDate() - 1);
      this.fecha1 = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy/MM") + "/01");
      this.fecha2 = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy/MM/dd"));
      this.servicio.aTextoPer("El mes pasado");
    }
    else if (periodo == "23") {
      let mesTemp = new Date(this.datepipe.transform(new Date(this.fecha1), "yyyy") + "/01/01");
      mesTemp.setDate(mesTemp.getDate() - 1);
      this.fecha1 = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/01/01");
      this.fecha2 = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/12/31");
      this.servicio.aTextoPer("El año pasado");
    }
    
    
  }

  aceptar()
 {
  this.errorFecha = false;

   if (this.miPeriodo == "1") 
   {
    this.servicio.aTextoPer("(" + this.datepipe.transform(this.fecha1, "yyyy/MM/dd") + " - " + this.datepipe.transform(this.fecha2, "yyyy/MM/dd") + ")" );
     if (!this.fecha1 || !this.fecha2)
       {
        if (!this.fecha2)
        {
         this.fecha2 = new Date();
        }
        if (!this.fecha1)
       {
         this.mensajeFecha ="Campo requerido";
         this.errorFecha=true;
         this.txtfechaDesde.nativeElement.focus();
         return;
       }
       }
    }
    if (this.fecha1 > this.fecha2)
    {
      this.mensajeFecha ="Fecha inicio > fecha fin";
      this.errorFecha=true;
         this.txtfechaDesde.nativeElement.focus();
         return;
    }

    this.servicio.aFechaDesde(this.datepipe.transform(this.fecha1, "yyy/MM/dd") + " 00:00:00");
    this.servicio.aFechaHasta(this.datepipe.transform(this.fecha2, "yyy/MM/dd") + " 23:59:59");
    this.servicio.aPeriodo(this.miPeriodo);
    this.servicio.aFSesion(true);
    this.servicio.aEstacion(this.miEstacion);
    
    this.datos.accion = 1;
    this.dialogRef.close(this.datos);
  }
 
}
