import { Injectable } from '@angular/core';
import { SERVER_API } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  constructor(
    public http: HttpClient
  ) { }

  obtenerSolicitudes(){
    let url = SERVER_API+"inscripcion/obtenerSolicitudes";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  obtenerInscripciones(){
    let url = SERVER_API+"inscripcion/obtenerInscripciones";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  obtenerRecibo(id : any){
    let url = SERVER_API+"inscripcion/obtenerRecibo/"+id;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  habilitarDeshabilitarEquipo(id : any,tipo : any){
    let url = SERVER_API+"inscripcion/habilitarDeshabilitarEquipo/"+id+"/"+tipo;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  validarSolicitud(id : any){
    let url = SERVER_API+"inscripcion/validarSolicitud/"+id;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  
//   enviar(json : any){
//     let url = SERVER_API+"registro/solicitud";
//     return this.http.post( url, json )
//       .pipe(map( (resp: any) => {
//         return resp;
//       }), catchError(err => {
//         Swal.fire("Ha ocurrido un error", err.error.message, 'error');
//         return throwError(err);
//       }));
//   }
}