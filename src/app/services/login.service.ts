import { Injectable } from '@angular/core';
import { SERVER_API } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    public http: HttpClient
  ) { }

  temporadaActual(){
    let url = SERVER_API+"temporadaActual";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  obtenerEquipo(usuario_id : number){
    let url = SERVER_API+"obtenerEquipo/"+usuario_id;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
//   login(json : any){
//     let url = SERVER_API+"registro/login";
//     return this.http.post( url, json )
//       .pipe(map( (resp: any) => {
//         return resp;
//       }), catchError(err => {
//         Swal.fire("Ha ocurrido un error", err.error.message, 'error');
//         return throwError(err);
//       }));
//   }
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