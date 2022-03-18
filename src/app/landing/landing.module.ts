import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing.routes';
import { LandingComponent } from './landing.component';
import { InicioComponent } from './inicio/inicio.component';
import { CompartidoModule } from '../landing/compartido/compartido.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReglasComponent } from './reglas/reglas.component';


@NgModule({
  declarations: [
    LandingComponent,
    InicioComponent,
    ReglasComponent,
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    LandingRoutingModule,
    NgbModule
  ]
})
export class LandingModule { }
