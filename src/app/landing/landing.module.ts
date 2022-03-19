import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing.routes';
import { LandingComponent } from './landing.component';
import { InicioComponent } from './inicio/inicio.component';
import { CompartidoModule } from '../landing/compartido/compartido.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReglasComponent } from './reglas/reglas.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    NgbModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LandingModule { }
