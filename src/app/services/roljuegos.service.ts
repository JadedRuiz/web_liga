import { Injectable } from '@angular/core';
import { SERVER_API } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolJuegosService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerJornadas(){
    let url = SERVER_API+"roljuegos/obtenerJornadas";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  obtenerJornadaActivo(){
    let url = SERVER_API+"roljuegos/obtenerJornadas";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  obtenerResultados(json : any){
    let url = SERVER_API+"roljuegos/obtenerResultados";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  obtenerStanding(json : any){
    let url = SERVER_API+"roljuegos/obtenerStanding";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
}