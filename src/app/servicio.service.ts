import { Injectable, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Observable, throwError } from 'rxjs';  
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  //URL_BASE = "http://localhost:8081/sigmacall/api/index.php?";
  //URL_MMCALL = "http://localhost:8081/locations/integration/simulate/";

  URL_BASE = "/sigmacall/api/index.php?";
  URL_MMCALL = "/locations/integration/simulate/";

  private horaDesde: string = "";
  private textoPer: string = "";
  private miVista: number = 0;
  private iniciarCuenta: boolean = false;
  private iniciado: boolean = false;
  private cambioVista: number = 0;
  private miFiltro: string = "";
  private colorArea: string = "";
  private fechaHasta: any;
  private fechaDesde: any;
  private periodo: number = 0;
  private filtroEstacion: any = "";
  private nPer : number = 0;
  private fSesion: boolean = false;
  private graficoEditar: number = 0;
  private anchoSN: number = 300;
  private usuarioActual: any = {id: 0, nombre: "", referencia: "", rol: 0, politica: 0, admin: "", tecnico: "", vista_resumida_fallas: false, upantalla: 0};
  private cambioClave: boolean = false;
  constructor(public datepipe: DatePipe,
              private httpClient: HttpClient
            ) 
            {}

  activarSpinner = new EventEmitter<boolean>();
  teclaBuscar = new EventEmitter<boolean>();
  teclaCambiar = new EventEmitter<boolean>();
  mensajeSuperior = new EventEmitter<string>();
  mensajeInferior = new EventEmitter<string>();
  aplicarFiltro = new EventEmitter<string>();
  mensajeToast = new EventEmitter<object>();
  esMovil = new EventEmitter<boolean>();
  iniUsuario = new EventEmitter<boolean>();
  cambioRouter = new EventEmitter<boolean>();
  actualizarT = new EventEmitter<boolean>();
  actualizarCh = new EventEmitter<boolean>();
  actualizarArea = new EventEmitter<boolean>();
  refrescarVista = new EventEmitter<boolean>();
  refrescarVistaArea = new EventEmitter<boolean>();
  refrescarGrafico = new EventEmitter<boolean>();
  llenarAreas = new EventEmitter<boolean>();
  bColor = new EventEmitter<any>();
  

  aHoraDesde(hora: string) {
    this.horaDesde = hora;
  }

  rHoraDesde() {
    return this.horaDesde ;
  }

  aPeriodo(periodo: any) {
    this.periodo = periodo;
  }

  rPeriodo() {
    return this.periodo ;
  }
  
  aEstacion(estacion: any) {
    this.filtroEstacion = estacion;
  }

  rEstacion() {
    return this.filtroEstacion ;
  }


  aNPer(nPeriodos: number) {
    this.nPer = nPeriodos;
  }

  rNPer() {
    return this.nPer ;
  }
  
  aCambioClave(cambio: boolean) {
    this.cambioClave = cambio;
  }

  rCambioClave() {
    return this.cambioClave ;
  }

  aAnchoSN(ancho: number) {
    this.anchoSN = ancho;
  }

  rAnchoSN() {
    return this.anchoSN ;
  }

  aFSesion(fSesion: boolean) {
    this.fSesion = fSesion;
  }

  rFSesion() {
    return this.fSesion ;
  }


  aGraficoEditar(grafico: number) {
    this.graficoEditar = grafico;
  }

  rGraficoEditar() {
    return this.graficoEditar ;
  }

  aFechaDesde(fecha: any) {
    this.fechaDesde = fecha;
  }

  rFechaDesde() {
    return this.fechaDesde ;
  }

  aFechaHasta(fecha: any) {
    this.fechaHasta = fecha;
  }

  rTextoPer() {
    return this.textoPer ;
  }

  aTextoPer(periodo: string) {
    this.textoPer = periodo;
  }

  rFechaHasta() {
    return this.fechaHasta ;
  }

  aVista(vista: number) {
    this.miVista = vista;
  }

  RVista() {
    return this.miVista ;
  }

  aFiltro(filtro: string) {
    this.miFiltro = filtro;
  }

  rFiltro() {
    return this.miFiltro ;
  }

  aColorArea(color: string) {
    this.colorArea = color;
  }

  rColorArea() {
    return this.colorArea ;
  }

  aCambioVista(vista: number) {
    this.cambioVista = vista;
  }

  aUsuario(valor: any) {
    this.usuarioActual = valor;
  }

  rUsuario() {
    return this.usuarioActual ;
  }

  rCambioVista() {
    return this.cambioVista ;
  }

  aInicio(iniciar: boolean) {
    this.iniciarCuenta = iniciar;
  }

  rInicio() {
    return this.iniciarCuenta ;
  }

  aIniciado(iniciado: boolean) {
    this.iniciado = iniciado;
  }

  rIniciado() {
    return this.iniciado ;
  }


  fecha(tipo: number, miFecha: string, formato: string): string {
    if (tipo == 1) {
      return this.datepipe.transform(new Date(), formato);
      }
    else if (tipo == 2) {
      if (!miFecha)
      {
        return "";  
      }
      else
      {
        return this.datepipe.transform(new Date(miFecha), formato);
      }
      
      }
    }

       consultasBD(campos: any): Observable<any> {      
      if (campos.accion == 100) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=consulta&sentencia=" + campos.consulta)
      }
      else if (campos.accion == 1000)
      {
        console.log(JSON.stringify(campos));
        return this.httpClient.post(this.URL_BASE + "accion=actualizar_alerta", JSON.stringify(campos))
      }
      else if (campos.accion == 1010)
      {
        console.log(JSON.stringify(campos));
        return this.httpClient.post(this.URL_BASE + "accion=actualizar_recipiente", JSON.stringify(campos))
      }

      else if (campos.accion == 1020)
      {
        console.log(JSON.stringify(campos));
        return this.httpClient.post(this.URL_BASE + "accion=actualizar_reporte", JSON.stringify(campos))
      }
      else if (campos.accion == 1030)
      {
        console.log(JSON.stringify(campos));
        return this.httpClient.post(this.URL_BASE + "accion=actualizar_usuario", JSON.stringify(campos))
      }
      
      else if (campos.accion == 1100) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=eliminar_alerta&id=" + campos.id)
      }
      else if (campos.accion == 1110) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=eliminar_recipiente&id=" + campos.id)
      }
      else if (campos.accion == 1200) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=eliminar_comodin&id=" + campos.id)
      }
      else if (campos.accion == 1210) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=eliminar_canal&id=" + campos.id)
      }
      else if (campos.accion == 2000) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=actualizar&sentencia=" + campos.consulta)
      }
      else if (campos.accion == 9000) {
        return this.httpClient.get<any>(this.URL_BASE + "accion=recuperar_imagenes" );
      }
    }  

    

    llamadaMMCall(campos: any): Observable<any> {
      if (campos.accion == 100) {
        return this.httpClient.get(this.URL_MMCALL + "action=call&code=" + campos.requester + "&key=1&custom_message=" + campos.mensaje, {responseType: 'text'});
      }
      else if (campos.accion == 200) {
        return this.httpClient.get(this.URL_MMCALL + "action=cancel&code=" + campos.requester, {responseType: 'text'});
      }
    }
    
}
