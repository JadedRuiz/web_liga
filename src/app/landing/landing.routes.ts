import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LandingComponent } from './landing.component';
import { ReglasComponent } from './reglas/reglas.component';

const routes: Routes = [{
  path : 'landing',
  component : LandingComponent,
  children : [
    { path : "inicio", component : InicioComponent },
    { path : "reglas", component : ReglasComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
