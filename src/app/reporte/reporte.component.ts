import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ServicioService } from '../servicio.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  log: boolean = false;
  fecha1 = new Date();
  fecha2 = new Date();
  habFecha: boolean = true;  
  errorFecha: boolean = true;
  miPeriodo: string = "1";
  mensajeFecha: string = "";
  miEstacion: string = "";
  miReporte: string = "1";
  estaciones = [];

  
  @ViewChild("fechaDesde", { static: true }) txtfechaDesde: ElementRef;
  
  constructor(
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<ReporteComponent>, 
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
    if (periodo == "11")
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
    }
    else if (periodo == "12")
    {
      let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
      this.fecha1 = new Date(nuevaFecha);
    }
    else if (periodo == "13")
    {
      let nuevaFecha = this.servicio.fecha(1, '' , "yyyy") + "/01/01";         
      this.fecha1 = new Date(nuevaFecha);
    }
    else if (periodo == "20") 
    {
      this.fecha1.setDate(this.fecha1.getDate() - 1);
      this.fecha2 = this.fecha1;
    }
    else if (periodo == "21") 
    {
      this.fecha1 = new Date();
      if (this.fecha1.getDay() == 0) 
      {
        this.fecha1.setDate(this.fecha1.getDate() - 13);
        this.fecha2.setDate(this.fecha2.getDate() - 7);
      }
      else 
      {
        this.fecha1.setDate(this.fecha1.getDate() - (this.fecha1.getDay()));
        this.fecha2.setDate(this.fecha2.getDate() - (this.fecha2.getDay() - 1) - 7);
      }
    }
    else if (periodo == "22") {
      let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";       
      this.fecha1 = new Date(nuevaFecha);  
      this.fecha1.setDate(this.fecha1.getDate() - 1);
      this.fecha2 = this.fecha1;
      nuevaFecha = this.datepipe.transform(this.fecha1, "yyyy/MM") + "/01"
      this.fecha1 = new Date(nuevaFecha);  
    }
    
  }

  aceptar()
 {
  this.errorFecha = false;

   if (this.miPeriodo == "1") 
   {
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
    let fDesde = this.datepipe.transform(this.fecha1, "yyy/MM/dd") + " 00:00:00";
    let fHasta = this.datepipe.transform(this.fecha2, "yyy/MM/dd") + " 23:59:59";
    
    if (this.miReporte!="2")
    {
      let consulta = "SELECT vw_alarmas.*, IFNULL(vw_reportes.id, 0) AS rid, vw_reportes.escalamientos from sigma.vw_alarmas LEFT JOIN vw_reportes ON vw_alarmas.reporte = vw_reportes.id WHERE vw_alarmas.inicio >= '" + fDesde + "' AND vw_alarmas.inicio <= '" + fHasta + "' ORDER BY vw_alarmas.id DESC";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
      if (registro && registro.length > 0) 
      {
          let exportCSV: string = "";
  
          // Loop the array of objects
          exportCSV = "Reporte de alarmas\r\n";
          exportCSV = exportCSV + "Generada en fecha: " + this.servicio.fecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n" + "\r\n";;
          exportCSV = exportCSV + '"Reporte","Nave","Estacion","Codigo","Descripcion","Inicia","Termina","Tiempo (seg)","Responsable","Tecnologia","Prioridad","Nivel de escalamiento", "Total repeticiones","Fecha/Hora escalamiento (1)","Fecha/Hora escalamiento (2)","Fecha/Hora escalamiento (3)","Fecha/Hora escalamiento (4)","Fecha/Hora escalamiento (5)"' + "\r\n";
          let lineas = 0;
          registro.forEach((elementos) => {
            lineas = lineas + 1
            exportCSV = exportCSV + '"' + elementos.rid + '",';
            exportCSV = exportCSV + '"' + elementos.nave + '",';
            exportCSV = exportCSV + '"' + elementos.estacion + '",';
            exportCSV = exportCSV + '"' + elementos.falla + '",';
            elementos.descripcion = elementos.descripcion.replace(/á/g, 'a');
            elementos.descripcion = elementos.descripcion.replace(/é/g, 'e');
            elementos.descripcion = elementos.descripcion.replace(/í/g, 'i');
            elementos.descripcion = elementos.descripcion.replace(/ó/g, 'o');
            elementos.descripcion = elementos.descripcion.replace(/ú/g, 'u');
            elementos.descripcion = elementos.descripcion.replace(/Á/g, 'A');
            elementos.descripcion = elementos.descripcion.replace(/É/g, 'E');
            elementos.descripcion = elementos.descripcion.replace(/Í/g, 'I');
            elementos.descripcion = elementos.descripcion.replace(/Ó/g, 'O');
            elementos.descripcion = elementos.descripcion.replace(/Ú/g, 'U');
            elementos.descripcion = elementos.descripcion.replace(/ñ/g, '~');
            elementos.descripcion = elementos.descripcion.replace(/Ñ/g, '~');
            exportCSV = exportCSV + '"' + elementos.descripcion + '",';
            exportCSV = exportCSV + '"' + elementos.inicio + '",';
            exportCSV = exportCSV + '"' + elementos.fin + '",';
            exportCSV = exportCSV + '"' + +elementos.tiempo + '",';
            exportCSV = exportCSV + '"' + elementos.responsable + '",';
            exportCSV = exportCSV + '"' + elementos.tecnologia + '",';
            exportCSV = exportCSV + '"' + elementos.prioridad + '",';
            if (!elementos.repeticiones)
            {
              exportCSV = exportCSV + '"0",' 
            }
            else
            {
              exportCSV = exportCSV + '"' + elementos.repeticiones + '",'   
            }
            if (!elementos.escalamientos)
            {
              exportCSV = exportCSV + '"0",' 
            }
            else
            {
              exportCSV = exportCSV + '"' + elementos.escalamientos + '",'   
            }
            if (elementos.escalada1)
            {
              exportCSV = exportCSV + '"' + elementos.escalada1 + '",';
            }
            else
            {
              exportCSV = exportCSV + '"",' 
            }
            if (elementos.escalada2)
            {
              exportCSV = exportCSV + '"' + elementos.escalada2 + '",';
            }
            else
            {
              exportCSV = exportCSV + '"",' 
            }
            if (elementos.escalada3)
            {
              exportCSV = exportCSV + '"' + elementos.escalada3 + '",';
            }
            else
            {
              exportCSV = exportCSV + '"",' 
            }
            if (elementos.escalada4)
            {
              exportCSV = exportCSV + '"' + elementos.escalada4 + '",';
            }
            else
            {
              exportCSV = exportCSV + '"",' 
            }
            if (elementos.escalada5)
            {
              exportCSV = exportCSV + '"' + elementos.escalada5 + '"';
            }
            else
            {
              exportCSV = exportCSV + '""' 
            } 
            exportCSV = exportCSV + "\r\n"   
          })
          exportCSV = exportCSV + "\r\n" 
          exportCSV = exportCSV + '"Total falla(es): "' + lineas
          var blob = new Blob([exportCSV], {type: 'text/csv' }),
          url = window.URL.createObjectURL(blob);
          let link = document.createElement('a')
          link.download = "Reporte de alarmas.csv";
          link.href = url
          link.click()
          window.URL.revokeObjectURL(url);
          link.remove();
        }
      })
    }
    if (this.miReporte!="1")
    {
      let consulta = "SELECT id, fecha, texto from sigma.vw_log WHERE fecha >= '" + fDesde + "' AND fecha <= '" + fHasta + "' ORDER BY id";
      let campos = { accion: 100, consulta: consulta };
      this.servicio.consultasBD(campos).subscribe((registro: any[]) => {
      if (registro && registro.length > 0) 
      {
          let exportCSV: string = "";
  
          // Loop the array of objects
          exportCSV = "Reporte de mensajes (log)\r\n";
          exportCSV = exportCSV + "Generada en fecha: " + this.servicio.fecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n" + "\r\n";;
          exportCSV = exportCSV + '"ID","Fecha","Mensaje"' + "\r\n";
          let lineas = 0;
          registro.forEach((elementos) => {
            lineas = lineas + 1
            exportCSV = exportCSV + '"' + elementos.rid + '",';
            exportCSV = exportCSV + '"' + elementos.fecha + '",';
            elementos.texto = elementos.texto.replace(/á/g, 'a');
            elementos.texto = elementos.texto.replace(/é/g, 'e');
            elementos.texto = elementos.texto.replace(/í/g, 'i');
            elementos.texto = elementos.texto.replace(/ó/g, 'o');
            elementos.texto = elementos.texto.replace(/ú/g, 'u');
            elementos.texto = elementos.texto.replace(/Á/g, 'A');
            elementos.texto = elementos.texto.replace(/É/g, 'E');
            elementos.texto = elementos.texto.replace(/Í/g, 'I');
            elementos.texto = elementos.texto.replace(/Ó/g, 'O');
            elementos.texto = elementos.texto.replace(/Ú/g, 'U');
            elementos.texto = elementos.texto.replace(/ñ/g, '~');
            elementos.texto = elementos.texto.replace(/Ñ/g, '~');

            exportCSV = exportCSV + '"' + elementos.texto + '",' + "\r\n";
          })
          exportCSV = exportCSV + "\r\n" 
          exportCSV = exportCSV + '"Total mensaje(s): "' + lineas
          var blob = new Blob([exportCSV], {type: 'text/csv' }),
          url = window.URL.createObjectURL(blob);
          let link = document.createElement('a')
          link.download = "Reporte de mensajes.csv";
          link.href = url
          link.click()
          window.URL.revokeObjectURL(url);
          link.remove();
        }
      })
    }
}
 
}
