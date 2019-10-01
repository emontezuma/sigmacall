import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  verTotal: boolean = true;
  isHandset: boolean = false;
  registros = [ {id: 0, titulo: "Crear un nuevo checklist", icono: "icono01", descripcion: "Permite crear una nueva lista de validación para capturar y tabular información", fecha: "lun, 06-May-2019 14:22"}, {id: 1, titulo: "Validación de control de calidad", icono: "icono02", descripcion: "A través de esta lista se podrán capturar todas las variables del sistema de Calidad ISO:9000", fecha: "lun, 06-May-2019 22:00"}, {id: 1, titulo: "Validación de sistemas (TI)", icono: "icono03", descripcion: "Utilice esta lista para validar si las aplicaciones están operando de manera satisfactoria", fecha: "lun, 06-May-2019 23:00"}, {id: 1, titulo: "Validación de mantenimiento", icono: "icono04", descripcion: "En esta lista están todas las variables concernientes al área de mantenimiento de la empresa.", fecha: "lun, 06-May-2019 23:30"} ];

  constructor() { }

     

  ngOnInit() {
  }

}
