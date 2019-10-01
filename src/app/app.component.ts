import { Component, ViewChild, AfterContentInit, HostListener, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatIconRegistry } from '@angular/material/icon';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Router } from '@angular/router';
import { ServicioService } from './servicio.service';
import { MatDialog } from '@angular/material';
import { CorreoComponent } from './correo/correo.component';
import { ConfigvivoComponent } from './configvivo/configvivo.component';
import { CnfigurarComponent } from './cnfigurar/cnfigurar.component';
import { GeneralComponent } from './general/general.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { CambioComponent } from './cambio/cambio.component';
import { ReporteComponent } from './reporte/reporte.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [trigger('efecto', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)'})),
    state('out', style({ opacity: 0, transform: 'translateY(10px)'})),
    transition('* <=> *', [
      animate(200)
    ])
  ])]
})



export class AppComponent implements AfterContentInit {
    
  autenticado: boolean = false;
  miVista: number = 0;
  noAutenticado: boolean = true;
  pantalla: number = 0;
  verProceso: boolean = false;
  abiertoSN: boolean = false;
  verIrArriba: boolean = false;
  verCronos: boolean = false;
  offSet: number;
  estacion: string = "Refrescar beepers";
  estacionIcono: string = "./assets/icons/refrescar.svg";
  cerrar_al_ejecutar: boolean = false;

  iconoCompania: string = "./assets/icons/logovw.png";
  logoCompania: string = "./assets/icons/vw.png";
  iconoCronos: string = "./assets/icons/cronos.png";
  logoAplicacion: string = "./assets/icons/logoapp.png";
  hora: any =  new Date();
  isHandset: boolean = false;
  notaSuperior: string = "";
  
  irArribaTT: string = "Ir al tope de la lista"
  cambioClave: string = "Cambiar contraseña..."
  cerrarSesion: string = "Cerrar la seisón";
  
  accion: string = "";
  usuarioActual: string = "Invitado";
  
  constructor(  public snackBar: MatSnackBar, 
                public scroll: ScrollDispatcher,
                iconRegistry: MatIconRegistry, 
                sanitizer: DomSanitizer, 
                private router: Router, 
                private breakpointObserver: BreakpointObserver,
                private servicio: ServicioService,
                public dialog: MatDialog, 
                ) {

    //Iconos propios
    this.breakpointObserver.observe(['(min-width: 600px)']).subscribe((estado: BreakpointState)=> {
        this.isHandset = !estado.matches;
        this.servicio.esMovil.emit(this.isHandset);
        if (this.isHandset && this.sidenav.opened)
        {
          this.menuIzquierdo();
        }
    })

    this.servicio.activarSpinner.subscribe((data: any)=>{this.verProceso = data});
    this.servicio.aCambioVista(0);
    

    iconRegistry.addSvgIcon('refrescar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/refrescar.svg'));
    iconRegistry.addSvgIcon('variables', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/variables.svg'));
    iconRegistry.addSvgIcon('listas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/listas.svg'));
    iconRegistry.addSvgIcon('tablas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/tablas.svg'));
    iconRegistry.addSvgIcon('equipos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/equipos.svg'));
    iconRegistry.addSvgIcon('catalogos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/catalogos.svg'));
    iconRegistry.addSvgIcon('exportar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/exportar.svg'));
    iconRegistry.addSvgIcon('consultas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/consultas.svg'));
    iconRegistry.addSvgIcon('vehiculos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/vehiculos.svg'));
    iconRegistry.addSvgIcon('choferes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/choferes.svg'));
    iconRegistry.addSvgIcon('acciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/acciones.svg'));
    iconRegistry.addSvgIcon('vistas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/vistas.svg'));
    iconRegistry.addSvgIcon('reloj', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reloj.svg'));
    iconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/menu.svg'));
    iconRegistry.addSvgIcon('cerrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cerrar.svg'));
    iconRegistry.addSvgIcon('cancelar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cancelar.svg'));
    iconRegistry.addSvgIcon('aceptar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/aceptar.svg'));
    iconRegistry.addSvgIcon('transportes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/transportes.svg'));
    iconRegistry.addSvgIcon('ocupados', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ocupados.svg'));
    iconRegistry.addSvgIcon('pregunta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pregunta.svg'));
    iconRegistry.addSvgIcon('error', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/error.svg'));
    iconRegistry.addSvgIcon('error_azul', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/error_azul.svg'));
    iconRegistry.addSvgIcon('llamadas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/llamadas.svg'));
    iconRegistry.addSvgIcon('eliminar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/eliminar.svg'));
    iconRegistry.addSvgIcon('nuevo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/nuevo.svg'));
    iconRegistry.addSvgIcon('mail', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mail.svg'));
    iconRegistry.addSvgIcon('mailconfig', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mailconfig.svg'));
    iconRegistry.addSvgIcon('buscar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/buscar.svg'));
    iconRegistry.addSvgIcon('configurar_b', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/configurar_b.svg'));
    iconRegistry.addSvgIcon('hora_b', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/hora_b.svg'));
    iconRegistry.addSvgIcon('buscar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/buscar.svg'));
    iconRegistry.addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/upload.svg'));
    iconRegistry.addSvgIcon('area', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/area.svg'));
    iconRegistry.addSvgIcon('areas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/areas.svg'));
    iconRegistry.addSvgIcon('asignar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/asignar.svg'));
    iconRegistry.addSvgIcon('beeper', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/beeper.svg'));
    iconRegistry.addSvgIcon('aplicacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/logoappw.png'));
    iconRegistry.addSvgIcon('libres', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/libres.svg'));
    iconRegistry.addSvgIcon('todas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/todas.svg'));
    iconRegistry.addSvgIcon('pendientes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pendientes.svg'));
    iconRegistry.addSvgIcon('porarea', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/porarea.svg'));
    iconRegistry.addSvgIcon('calidad', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/calidad.svg'));
    iconRegistry.addSvgIcon('it', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/it.svg'));
    iconRegistry.addSvgIcon('mantto', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mantto.svg'));
    iconRegistry.addSvgIcon('envivo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/envivo.svg'));
    iconRegistry.addSvgIcon('rendimiento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/porrendimiento.svg'));
    iconRegistry.addSvgIcon('tecnologia', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/portecnologia.svg'));
    iconRegistry.addSvgIcon('estacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/porestacion.svg'));
    iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/settings.svg'));
    iconRegistry.addSvgIcon('distribucion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/distribucion.svg'));
    iconRegistry.addSvgIcon('mensaje', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mensaje.svg'));
    iconRegistry.addSvgIcon('recipiente', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/recipiente.svg'));
    iconRegistry.addSvgIcon('usuario', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/usuario.svg'));
    iconRegistry.addSvgIcon('usuarioSolo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/usuarioSolo.svg'));
    iconRegistry.addSvgIcon('grafica', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/grafica.svg'));
    iconRegistry.addSvgIcon('monitor', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/monitor.svg'));
    iconRegistry.addSvgIcon('subir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/subir.svg'));
    iconRegistry.addSvgIcon('mas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mas.svg'));
    iconRegistry.addSvgIcon('actualizar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/actualizar.svg'));
    iconRegistry.addSvgIcon('inactivo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/inactivo.svg'));
    iconRegistry.addSvgIcon('copiar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/copiar.svg'));
    iconRegistry.addSvgIcon('destinatario', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/destinatario.svg'));
    iconRegistry.addSvgIcon('alerta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/alerta.svg'));
    iconRegistry.addSvgIcon('ayuda', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ayuda.svg'));
    iconRegistry.addSvgIcon('fallas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/fallas.svg'));
    iconRegistry.addSvgIcon('configurarMail', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/configurarmail.svg'));
    iconRegistry.addSvgIcon('carrusel', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/carrusel.svg'));
    iconRegistry.addSvgIcon('formato', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/formato.svg'));
    iconRegistry.addSvgIcon('filtrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/filtrar.svg'));
    iconRegistry.addSvgIcon('filtrar_aj', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/filtrar_aj.svg'));
    iconRegistry.addSvgIcon('descargar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/descargar.svg'));
    iconRegistry.addSvgIcon('crono', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/crono.svg'));
    iconRegistry.addSvgIcon('top10', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/top10.svg'));
    iconRegistry.addSvgIcon('candado', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/candado.svg'));
    iconRegistry.addSvgIcon('cambioUsuario', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cambioUsuario.svg'));
    iconRegistry.addSvgIcon('cerrarSesion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cerrarSesion.svg'));
    iconRegistry.addSvgIcon('cambioClave', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cambioClave.svg'));
    iconRegistry.addSvgIcon('views', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/views.svg'));
    iconRegistry.addSvgIcon('verClave', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/verClave.svg'));
    iconRegistry.addSvgIcon('verClave2', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/verClave2.svg'));
    this.scrollingSubscription = this.scroll
    .scrolled()
    .subscribe((data: CdkScrollable) => {
      this.miScroll(data);
    });

    this.reloj();
    this.servicio.mensajeSuperior.subscribe((mensaje: any)=>{this.notaSuperior = mensaje});
    this.servicio.mensajeInferior.subscribe((mensaje: any)=>{this.accion = mensaje});
    this.servicio.mensajeToast.subscribe((mensaje)=>{
      this.toast(mensaje.clase, mensaje.mensaje, mensaje.tiempo)
    });
    this.servicio.iniUsuario.subscribe((mensaje: boolean)=>
    {
      
      this.recuperar();
    });
    setTimeout(() => {
      this.servicio.aInicio(true);        
    }, 500);

    this.autenticar("T", "");

  }
  
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) 
  {
    if (event.ctrlKey  && (event.keyCode == 66 || event.keyCode == 98))
    {
      this.buscar()
    }

    else if (event.keyCode == 118)
    {
      this.cambiarVista()
    }

    else if (event.ctrlKey  && (event.keyCode == 123 || event.keyCode == 123))
    {

    }

    else if (event.keyCode == 113)
    {
      this.menuIzquierdo();
    }

    
  }
  @ViewChild('barraIzquierda', { static: true }) sidenav: MatSidenav;
  scrollingSubscription: Subscription
  verMenuSuperior: boolean = true;

  ngAfterContentInit() {

    
    
    this.estado="in";
    this.router.events.subscribe((val) => {
      //Se valida que exista el usuario
      this.servicio.cambioRouter.emit(true);
      this.buscarCia();
    })
    this.buscarCia();
    setTimeout(() => {
      this.revisarLog();   
    }, 1000);
    
    
  }

  cambiarClave()
  {
    
    this.servicio.aCambioClave(true);
    const dialogRef = this.dialog.open(CambioComponent, {
      width: '370px', height: '420px', data: { id: 0, accion: 0, idUT: this.servicio.rUsuario().id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) {
        //Se cancela la llamada
      }
    });
  }

  buscar()
  {
    this.servicio.teclaBuscar.emit(true);
  }

  cambiarVista()
  {     
    this.servicio.teclaCambiar.emit(true);
  }


escapar()
{
  this.buscar()
}


  buscarCia()
  {
    let consulta = "SELECT name FROM mmcall.locations";
    let campos = {accion: 100, consulta: consulta};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      if (datos && datos.length > 0)
      {
        this.accion = datos[0].name; 
      }
    })
  }
  
  irArriba() {
    window.requestAnimationFrame(this.irArriba);
    document.querySelector('[cdkScrollable]').scrollTop = 0;    
  }

  miScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
     if (scrollTop < 5) {
      this.verIrArriba = false
    }
     else {
      this.verIrArriba = true
    }

    this.offSet = scrollTop;
  }


    getState(outlet){
      return outlet.activatedRouteData.state;
    }
    
    toast(clase: string, mensaje: string, duracion: number) {
      let config = new MatSnackBarConfig();
        config.panelClass = [clase];
        config.duration = duracion;
        config.verticalPosition='bottom';
        this.snackBar.open(mensaje, null, config);
    }

  estado: string = "";  
  appVersion: string = "versión: 1.06.20082019"
  verBarra: boolean = false;
  verPie: boolean = true;
  iconoHamburguesa: string = "menu";
  menuHamburguesaTT: string  = "Abrir panel de opciones";
  configTT: string  = "Configurar correo base";
  mensajeSuperior: string = "";
  

menuIzquierdo() {
    this.sidenav.toggle();
    
    this.verBarra = !this.verBarra;
    
    if (!this.sidenav.opened){
      this.iconoHamburguesa="menu";
      this.menuHamburguesaTT = "Abrir panel de opciones";
      this.servicio.aAnchoSN(0);
    }
    else {
      this.iconoHamburguesa="cerrar";
      this.menuHamburguesaTT = "Cerrar el panel de opciones";
      this.servicio.aAnchoSN(300);
    }
    this.servicio.refrescarGrafico.emit(true);
  }

    reloj()
    {
      setInterval(() => {
        this.hora = new Date();
      }, 1000);
    }

    graficar(vista: number)
    {
      this.miVista = vista;
      this.autenticar("C", "graficas")
  
    }

  alertas()
  {
    this.autenticar("S", "alertas")
    
  }

  usuarios()
  {
    this.autenticar("A", "usuarios")
        
  }

  recipientes()
  {
    this. autenticar("S", "recipientes")
    
  }

  fallas()
  {
    this.autenticar("C","fallas")
        
  }
  
cerrarSalir()
{
  if (this.cerrar_al_ejecutar)
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="menu";
        this.menuHamburguesaTT = "Abrir panel de opciones";
        this.servicio.aAnchoSN(0);  
        this.servicio.refrescarGrafico.emit(true);
      }, 400);
      
    }
    if (this.pantalla>0)
    {
      let consulta = "UPDATE sigma.cat_usuarios SET ultima_pantalla = " + this.pantalla + " WHERE id = " + this.servicio.rUsuario().id;
      let campos = {accion: 2000, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      })
    }
}

  irCronos() {
    window.open("http://www.mmcallmexico.mx/  ", "_blank");
  }

  configMail()
{
  this.autenticar("A", "CM")
    }



configVivo()
{
  this.autenticar("A", "CV")
      
  }

configMonitor()
{
  this.autenticar("A", "CB")
    
  }

revisarLog()
{
  let consulta = "SELECT id, texto FROM sigma.vw_log WHERE aplicacion = 10 AND visto = 'N' ORDER BY id LIMIT 1";
  let campos = {accion: 100, consulta: consulta};  
  this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
    if (registro && registro.length>0)
    {
      
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "custom-class-red";
      mensajeCompleto.mensaje = registro[0].texto;;
      mensajeCompleto.tiempo = 4000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.servicio.llenarAreas.emit(true);
      
      //this.playLlamada()
      consulta = "UPDATE sigma.vw_log SET visto = 'S' WHERE id = " + registro[0].id;
      let campos = {accion: 2000, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
        setTimeout(() => {
          this.revisarLog();   
        }, 5000);
      })
    }
    else
    {
      setTimeout(() => {
        this.revisarLog();   
      }, 1000);
  
    }

  })  
}

recuperar()
{
  
  let consulta = "SELECT * FROM sigma.cat_usuarios WHERE id = " + this.servicio.rUsuario().id;
  let campos = {accion: 100, consulta: consulta};  
  this.servicio.consultasBD(campos).subscribe((registro: any []) =>{
    if (registro && registro.length>0)
    {
      this.cerrar_al_ejecutar = registro[0].cerrar_al_ejecutar == "S";
      this.abiertoSN = !this.cerrar_al_ejecutar;
      if (this.cerrar_al_ejecutar){
        this.iconoHamburguesa="menu";
        this.menuHamburguesaTT = "Abrir panel de opciones";
        this.servicio.aAnchoSN(0);
      }
      else {
        this.iconoHamburguesa="cerrar";
        this.menuHamburguesaTT = "Cerrar el panel de opciones";
        this.servicio.aAnchoSN(300);
      }

      this.servicio.aUsuario({id: registro[0].id, nombre: registro[0].nombre, referencia: registro[0].referencia, rol: registro[0].rol, politica: registro[0].politica, admin: (registro[0].admin == "S" ? true : false), vista_resumida_fallas: (registro[0].vista_resumida_fallas == "S" ? true : false), upantalla: +registro[0].ultima_pantalla })
      this.usuarioActual = this.servicio.rUsuario().referencia;
      if (this.servicio.rUsuario().ultima_pantalla != 0)
      {
        this.cerrarSalir()
      }  
      
      }
  })
}

playLlamada() {
  let audio = new Audio();
  audio.src = "./assets/llamada.wav";
  audio.load();
  audio.play();
}

elvis()
{
  alert('elvis');
}

cambioSN()
{}

carrusel()
{
  this.autenticar("C", "carrusel")

}

correos()
{
  this.autenticar("S", "cuentas")
    
  }

  
exportar()
{
  this.autenticar("A", "exportar")
      
}

cierreSesion()
{
  const dialogRef = this.dialog.open(GeneralComponent, {
    width: '380px', height: '250px', data: { titulo: "Cerrar sesión", mensaje: "Esta acción cerrará su sesión en el sistema. ¿Desea continuar?", alto: "80", id: 0, accion: 0, botones: 2, boton1STR: "Si, cerrar mi sesión", boton2STR: "Cancelar", icono: "pregunta" }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result.accion == 1) 
    {
      this.router.navigateByUrl('/home');
      this.noAutenticado=true;
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "custom-class";
      mensajeCompleto.mensaje = "El usuario " + this.servicio.rUsuario().nombre + " ha finalizado su sesión"
      this.usuarioActual = "Invitado";
      mensajeCompleto.tiempo = 3000;
      this.servicio.mensajeToast.emit(mensajeCompleto);        
      this.servicio.aUsuario({id: 0, nombre: ""});

    }
  })
}

autenticar(tipoAtenticacion: string, opcion: string)
{
  this.autenticado = false;
  if (tipoAtenticacion == "A" && this.servicio.rUsuario().rol == "A")
  {
    this.autenticado = true;
    this.ejecutarOpcion(opcion);
  }
  else if (tipoAtenticacion == "S" && (this.servicio.rUsuario().rol == "S" || this.servicio.rUsuario().rol == "A"))
  {
    this.autenticado = true;
    this.ejecutarOpcion(opcion);
  }
  else if (tipoAtenticacion == "C" && this.servicio.rUsuario().rol!="")
  {
    this.autenticado = true;
    this.ejecutarOpcion(opcion);
  }
  else
  {
    const dialogRef = this.dialog.open(IngresoComponent, {
      width: '350px', height: '350px', data: { id: 0, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        this.noAutenticado = false;
          if (tipoAtenticacion =="A" && this.servicio.rUsuario().rol!="A" || (tipoAtenticacion =="S" && this.servicio.rUsuario().rol=="C"))
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "custom-class-red";
          mensajeCompleto.mensaje = "Privilegios insuficientes";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);             
        }
        else
        {
          this.autenticado = true;
          this.ejecutarOpcion(opcion);
        }
        
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "custom-class-red";
        mensajeCompleto.mensaje = "El usuario canceló la autenticación";
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);             
      }
    });
  }
}

ejecutarOpcion(opcion: string)
{
  if (opcion == "exportar")
          {
            const dialogRef = this.dialog.open(ReporteComponent, {
              width: '500px', height: '410px', data: { id: 0, accion: 0 }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result.accion == 1) {
                //Se cancela la llamada
              }
            });
          }
          else if (opcion == "CV") 
          {
            const dialogRef = this.dialog.open(ConfigvivoComponent, {
              width: '550px', height: '520px', data: { id: 0, accion: 0 }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result.accion == 1) {
                //Se cancela la llamada
              }
            });
          }
          else if (opcion == "CM") 
          {
            const dialogRef = this.dialog.open(CorreoComponent, {
              width: '500px', height: '520px', data: { id: 0, accion: 0 }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result.accion == 1) {
                //Se cancela la llamada
              }
            });
          }  
          else if (opcion == "CB") 
            {
            const dialogRef = this.dialog.open(CnfigurarComponent, {
              width: '550px', height: '570px', data: { id: 0, accion: 0 }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result.accion == 1) {
                //Se cancela la llamada
              }
            });
          }
          else if (opcion=="cuentas")
          {
            if (this.estado != "")
            {
              this.estado = "out";
            }
            this.servicio.aIniciado(false);
            setTimeout(() => {
              this.pantalla = 5;
              this.estado="in";
              this.router.navigateByUrl('/cuentas');
              this.cerrarSalir()
            }, 300);
          }
          else if (opcion=="carrusel")
          {
            if (this.estado != "")
            {
              this.estado = "out";
            }
            this.servicio.aIniciado(false);
            setTimeout(() => {
              this.pantalla = 2;
              this.estado="in";
              this.router.navigateByUrl('/carrusel');
              this.cerrarSalir()
            }, 300);
          }
          else if (opcion=="graficas")
          {
            this.servicio.aGraficoEditar(this.miVista);
            if (this.estado != "")
            {
              this.estado = "out";
            }
            setTimeout(() => {
              this.pantalla = 10 + this.miVista;
              this.estado = "in";
              this.servicio.aVista(this.miVista);
              //this.servicio.aCambioVista(this.servicio.rCambioVista() + 1);
              if (this.router.url.substr(0, 9) != "/graficas")
              {
                this.router.navigateByUrl('/graficas');
              }
              else
              {
                this.servicio.refrescarVista.emit(true);
              } 
              this.cerrarSalir()
                }, 300);
            }
            else if (opcion=="fallas")
            {
              if (this.estado != "")
              {
                this.estado = "out";
              }
              this.servicio.aIniciado(false);
              setTimeout(() => {
                this.pantalla = 1;
                this.estado="in";
                this.router.navigateByUrl('/fallas');
                this.cerrarSalir()
              }, 300);
              
            }
            else if (opcion=="recipientes")
            {
              if (this.estado != "")
              {
                this.estado = "out";
              }
              this.servicio.aIniciado(false);
              setTimeout(() => {
                this.pantalla = 3;
                this.estado="in";
                this.router.navigateByUrl('/recipientes');
                this.cerrarSalir()
              }, 300);
            }
            else if (opcion=="alertas")
            {
          
              if (this.estado != "")
              {
                this.estado = "out";
              }
              this.servicio.aIniciado(false);
              setTimeout(() => {
                this.pantalla = 4;
                this.estado="in";
                this.router.navigateByUrl('/alertas');
                this.cerrarSalir()
              }, 300);
            }
            else if (opcion=="usuarios")
            {
              if (this.estado != "")
              {
                this.estado = "out";
              }
              this.servicio.aIniciado(false);
              setTimeout(() => {
                this.pantalla = 6;
                this.estado="in";
                this.router.navigateByUrl('/usuarios');
                this.cerrarSalir()
              }, 300);
            }


}
}

