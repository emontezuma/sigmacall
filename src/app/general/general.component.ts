import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  mensaje: string = "";
  icono: string = "";
  titulo: string = "";
  boton1STR: string = "";
  boton2STR: string = "";
  tBotones: number = 1;
  accion: number = 0;
  alto: number = 0;
  
  constructor(
    public dialogRef: MatDialogRef<GeneralComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
    ) 
    { 
      this.mensaje = datos.mensaje;
      this.titulo = datos.titulo;
      this.icono = datos.icono;
      this.boton1STR = datos.boton1STR;
      this.boton2STR = datos.boton2STR;
      this.tBotones = datos.botones;
      this.accion = datos.accion;
      this.alto = datos.alto;
    }

ngOnInit() {
}

guardar(formulario: NgForm)
  {
    
  }

validar(id: number)
{
  this.datos.accion = id;
  this.dialogRef.close(this.datos);
}

  cancelar() 
  {
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }
}
