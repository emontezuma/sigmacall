import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import localeEs from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { ServicioService } from './servicio.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'hammerjs';
import 'rxjs';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { MaterialModule } from './material/material.module';
import { generate } from 'rxjs';
import { InicioComponent } from './inicio/inicio.component';
import { DxChartModule, DxPieChartModule } from 'devextreme-angular';
import { DxColorBoxModule } from 'devextreme-angular';
import { RecipientesComponent } from './recipientes/recipientes.component';
import { RecipienteComponent } from './recipiente/recipiente.component';
import { GeneralComponent } from './general/general.component';
import { ListarFallasComponent } from './listar-fallas/listar-fallas.component';
import { ListasComponent } from './listas/listas.component';
import { ListaComponent } from './lista/lista.component';
import { GraficaComponent } from './grafica/grafica.component';
import { DxCircularGaugeModule } from 'devextreme-angular'
import { DxLinearGaugeModule } from 'devextreme-angular'
import { DxBarGaugeModule } from 'devextreme-angular';
import { GraficaParamComponent } from './grafica-param/grafica-param.component';
import { GraficaFormatComponent } from './grafica-format/grafica-format.component';
import { CorreoComponent } from './correo/correo.component';
import { CnfigurarComponent } from './cnfigurar/cnfigurar.component';
import { FallasComponent } from './fallas/fallas.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { ConfigvivoComponent } from './configvivo/configvivo.component';
import { CarruselComponent } from './carrusel/carrusel.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { CambioComponent } from './cambio/cambio.component';
import { BlankComponent } from './blank/blank.component';
import { ReporteComponent } from './reporte/reporte.component'


registerLocaleData(localeEs);

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full', data:  { state: 'home' } },
  { path: 'home', component: BlankComponent, data:  { state: 'home' } },
  { path: 'alertas', component: RecipientesComponent, data:  { state: 'alertas' } },
  { path: 'recipientes', component: ListasComponent, data:  { state: 'recipientes' } },
  { path: 'graficas', component: GraficaComponent, data:  { state: 'graficas' } },
  { path: 'fallas', component: FallasComponent, data:  { state: 'fallas' } },
  { path: 'cuentas', component: CuentasComponent, data:  { state: 'cuentas' } },
  { path: 'carrusel', component: CarruselComponent, data:  { state: 'carrusel' } },
  { path: 'usuarios', component: UsuariosComponent, data:  { state: 'usuarios' } },
];

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RecipientesComponent,
    RecipienteComponent,
    GeneralComponent,
    ListarFallasComponent,
    ListasComponent,
    ListaComponent,
    GraficaComponent,
    GraficaParamComponent,
    GraficaFormatComponent,
    CorreoComponent,
    CnfigurarComponent,
    FallasComponent,
    CuentasComponent,
    CuentaComponent,
    ConfigvivoComponent,
    CarruselComponent,
    UsuariosComponent,
    UsuarioComponent,
    IngresoComponent,
    CambioComponent,
    BlankComponent,
    ReporteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ScrollingModule,
    PlatformModule,
    DxChartModule,
    DxColorBoxModule,
    DxCircularGaugeModule,
    DxLinearGaugeModule,
    DxBarGaugeModule
  ],
  entryComponents: [ RecipienteComponent, GeneralComponent, ListarFallasComponent, ListaComponent, GraficaParamComponent, GraficaFormatComponent, CorreoComponent, CnfigurarComponent, CuentaComponent, ConfigvivoComponent, UsuarioComponent, CambioComponent, IngresoComponent, ReporteComponent],
  providers: [ ServicioService, {provide: LOCALE_ID, useValue: "es-MX" }, DatePipe, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
