import { Injectable } from '@angular/core';
import { SERVER_API } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {

  constructor(
    public http: HttpClient
  ) { }

  validarCurp(json : any){
    let url = SERVER_API+"jugadores/validarCurp";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      })
    );
  }

  altaJugador(json : any){
    let url = SERVER_API+"jugadores/altaJugador";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  bajaJugador(id_jugador : any){
    let url = SERVER_API+"jugadores/bajaJugador/"+id_jugador;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  obtenerJugadoresAdmin(){
    let url = SERVER_API+"jugadores/obtenerJugadoresAdmin";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  obtenerJugadorPorId(id_jugador : any){
    let url = SERVER_API+"jugadores/obtenerJugadorPorId/"+id_jugador;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  busquedaJugadores(json : any){
    let url = SERVER_API+"jugadores/busquedaJugadores";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  altaJugadorAdmin(json : any){
    let url = SERVER_API+"jugadores/altaJugadorAdmin";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  obtenerEquipos(){
    let url = SERVER_API+"jugadores/obtenerEquipos";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  altaJugadorAEquipo(json : any){
    let url = SERVER_API+"jugadores/altaJugadorAEquipo";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
}