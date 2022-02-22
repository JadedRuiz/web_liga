import { Injectable } from '@angular/core';
import { SERVER_API } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(
    public http: HttpClient
  ) { }

//   obtenerDatos(id : string){
//     let url = SERVER_API+"inicio/obtenerDatos/"+id;
//     return this.http.get( url )
//       .pipe(map( (resp: any) => {
//         return resp;
//       }));
//   }
  obtenerReporte(json : any){
    let url = SERVER_API+"reportes/obtenerReporte";
    return this.http.post( url, json )
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