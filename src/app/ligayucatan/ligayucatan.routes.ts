import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginGuardGuard } from '../services/guard/login_guard.guard';
import { LigaYucatanComponent } from './ligayucatan.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { ReportesComponent } from './reportes/reportes.component';
import { IncripcionComponent } from './incripcion/incripcion.component';
import { JugadoresAdminComponent } from './jugadores-admin/jugadores-admin.component';

const routes: Routes = [{
  path : 'ligayucatan',
  component : LigaYucatanComponent,
  canActivate : [ LoginGuardGuard ],
  children : [
    { path : "inicio", component : InicioComponent },
    { path : "jugadores", component : JugadoresComponent },
    { path : "reportes", component : ReportesComponent},
    { path : "inscripcion", component : IncripcionComponent},
    { path : "jugadores_admin", component : JugadoresAdminComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LigayucatanRoutingModule { }
