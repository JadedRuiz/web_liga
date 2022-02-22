import { Injectable } from '@angular/core';
import { SERVER_API } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(
    public http: HttpClient
  ) { }

  catalogoCategorias(){
    let url = SERVER_API+"categorias";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  login(json : any){
    let url = SERVER_API+"registro/login";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  enviar(json : any){
    let url = SERVER_API+"registro/solicitud";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  recuperarContra(json : any){
    let url = SERVER_API+"registro/recuperarContra";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  enviarContra(id_usuario : any){
    let url = SERVER_API+"registro/enviarContra/"+id_usuario;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
//   actualizarCandidato(candidato : Candidato){
//     let url = SERVER_API+"candidato/actualizarCandidato";
//     return this.http.post( url, candidato )
//       .pipe(map( (resp: any) => {
//         return resp;
//       }), catchError(err => {
//         if(err.error.message.includes("String data, right truncated: 1406 Data too long for column 'fotografia'")){
//           Swal.fire("Ha ocurrido un error", "La imagen que deseas cargar es demasiado pesada para ser almacenada", 'error');
//         }else{
//           Swal.fire("Ha ocurrido un error", err.error.message, 'error');
//         }
//         return throwError(err);
//       }));
//   }
//   obtenerCandidatosPorIdCliente(id : any){
//     let url = SERVER_API+"candidato/obtenerCandidatosPorIdCliente/"+id;
//     return this.http.get(url);
//   }
//   obtenerCandidatoActivoId(id : any){
//     let url = SERVER_API+"candidato/obtenerCandidatoActivoId/"+id;
//     return this.http.get(url);
//   }
//   obtenerCandidatoPorId(id : any){
//     let url = SERVER_API+"candidato/obtenerCandidatoPorId/"+id;
//     return this.http.get(url);
//   }
//   eliminarCandidato(id : any){
//     let url = SERVER_API+"candidato/eliminarCandidato/"+id;
//     return this.http.get(url);
//   }
//   autoCompleteCandidato(json : any){
//     let url = SERVER_API+"candidato/autoCompleteCandidato";
//     return this.http.post( url, json )
//       .pipe(map( (resp: any) => {
//         return resp;
//       }), catchError(err => {
//         Swal.fire("Ha ocurrido un error", err.error, 'error');
//         return throwError(err);
//       }));
//   }
//   obtenerMovientosCandidato(id : any){
//     let url = SERVER_API+"candidato/obtenerMovientosCandidato/"+id;
//     return this.http.get(url);
//   }
}
