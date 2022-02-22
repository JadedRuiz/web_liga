import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigayucatanRoutingModule } from './ligayucatan.routes';
import { LigaYucatanComponent } from './ligayucatan.component';
import { InicioComponent } from './inicio/inicio.component';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { ReportesComponent } from './reportes/reportes.component';
import { IncripcionComponent } from './incripcion/incripcion.component';
import {BrowserModule} from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JugadoresAdminComponent } from './jugadores-admin/jugadores-admin.component';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    LigaYucatanComponent,
    InicioComponent,
    JugadoresComponent,
    ReportesComponent,
    IncripcionComponent,
    JugadoresAdminComponent,
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    LigayucatanRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    WebcamModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatIconModule
  ],
  bootstrap : [LigaYucatanComponent]
})
export class LigayucatanModule { }
