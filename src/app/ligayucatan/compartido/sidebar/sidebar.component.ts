import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public menuItems = Array();
  public equipo = "";
  public temporada = "";
  public id_usuario = parseInt(window.sessionStorage.getItem("UsuarioID")+"");
  public perfil = window.sessionStorage.getItem("Perfil");

  constructor(
    private router : Router,
    private login_service : LoginService
    ) { }

  ngOnInit(): void {
    this.pintarMenu();
    this.getEquipo();
    this.getTemporadaActual();
  }

  getEquipo(){
    this.login_service.obtenerEquipo(this.id_usuario)
    .subscribe((object : any) => {
      if(object.ok){
        this.equipo = object.data.Equipo;
      }else{
        this.equipo  = "";
      }
    })
  }
  getTemporadaActual(){
    this.login_service.temporadaActual()
    .subscribe((object : any) => {
      if(object.ok){
        this.temporada = object.data;
      }else{
        this.temporada = object.message;
      }
    })
  }
  pintarMenu(){
    if(this.perfil == "admin"){
      this.menuItems = [
        { path : "inscripcion", title : "Inscripciones", icon : "fas fa-sign-in-alt", id : "inscipcion", active : "active" },
        { path : "jugadores_admin", title : "Jugadores", icon : "fas fa-id-badge", id : "jugador", active : "" },
        { path : "reportes", title : "Reportes", icon : "fas fa-file-excel", id : "reporte", active : "" },
      ];
      this.activar("inscipcion");
    }else{
      this.menuItems = [
        { path : "inicio", title : "Mi equipo", icon : "fas fa-home", id : "equipo", active : "active"},
        { path : "jugadores", title : "Jugadores", icon : "fas fa-id-badge", id : "jugador", active : "" },
        // { path : "equipos", title : "Equipos", icon : "fas fa-baseball-ball", id : "equipos", active : "" },
        // { path : "reportes_repre", title : "Reportes", icon : "fas fa-file-excel", id : "reporte", active : "" },
        // { path : "inscripcion_repre", title : "Inscripciones", icon : "fas fa-sign-in-alt", id : "inscipcion", active : "" },
      ];
    }
  }

  activar(id : string){
    this.menuItems.forEach((element : any)  => {
      if(element.id == id){
        element.active = "active";
        $("#titlulo_header").html(element.title);
      }else{
        element.active = "";
      }
    });
  }
  Logout(){
    window.sessionStorage.removeItem("UsuarioID");
    window.sessionStorage.removeItem("InscripcionID");
    window.sessionStorage.removeItem("Perfil");
    this.router.navigate(['/landing/inicio']);
  }
}
