import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistroService } from '../services/registro.service';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login = {
    usuario : "",
    contra : ""
  };
  correo = "";
  info = {
    nombre : "",
    telefono : "",
    equipo : "",
    correo : "",
    usuario_id : 0
  };
  temporadaa = "";
  @ViewChild('recuperar',{}) modal;
  mostrarInfo = true;
  tipo = 0;
  modal_obj : any;
  coincidencias : any;

  constructor(
    private registro_service : RegistroService,
    private login_service : LoginService,
    private router : Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getTemporadaActual();
  }
  getTemporadaActual(){
    this.login_service.temporadaActual()
    .subscribe((object : any) => {
      if(object.ok){
        this.temporadaa = object.data;
      }else{
        this.temporadaa = object.message;
      }
    })
  }
  Login(){
    this.registro_service.login(this.login)
    .subscribe((object : any) => {
      if(object.ok){
        window.sessionStorage.setItem("Perfil",object.data[0].tipo);
        if(object.data[0].tipo != "admin"){
          window.sessionStorage.setItem("InscripcionID",object.data[0].InscripcionID);
          window.sessionStorage.setItem("UsuarioID",object.data[0].UsuarioID);
          this.router.navigate(['/ligayucatan/inicio']);
        }else{
          this.router.navigate(['/ligayucatan/inscripcion']);
        }
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    })
  }

  recuperarContra(){
    this.coincidencias = [];
    this.registro_service.recuperarContra({correo : this.correo})
    .subscribe((object : any) => {
      if(object.ok){
        if(object.data.tipo == 1){
          this.mostrarInfo = false;
          this.tipo = 1;
          this.info.usuario_id = object.data.data[0].UsuarioID;
          this.info.nombre = object.data.data[0].nombre;
          this.info.equipo = object.data.data[0].Equipo;
          this.info.telefono = object.data.data[0].TelRep;
          this.info.correo = object.data.data[0].MailRep;
        }else{
          if(object.data.tipo == 2){
            this.mostrarInfo = false;
            this.tipo = 2;
            this.coincidencias = object.data.data;
          }else{
            this.mostrarInfo = false;
            Swal.fire("Ha ocurrido un error","No hemos encontrado ningun usaurio en está temporada con el correo proporcionado","error");
          }
        }
        
      }
    });
  }
  
  enviarContra(dato : any){
    if(dato == 0){
      dato = this.info.usuario_id;
    }
    this.confirmar("Confirmación","¿Sus datos concuerdan con el correo asociado?","info",1, dato);
  }
  
  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, dato : any){
    Swal.fire({
      title: title,
      text: texto,
      icon: tipo_alert,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 1){  //Recuperar contra
          this.registro_service.enviarContra(dato)
          .subscribe((object : any) => {
            if(object.ok){
              this.formatear();
              Swal.fire("Buen trabajo",object.data,"success");
            }
          });
        }
      }
    });
  }
  openModal() {
    this.modal_obj = this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title', centered : true, backdrop: 'static', keyboard: false});
  }
  cerrarModal() { 
    this.modal_obj.close();
    this.formatear();
  }
  formatear(){
    this.mostrarInfo = true;
    this.tipo = 0;
    this.correo = "";
    this.info = {
      nombre : "",
      telefono : "",
      equipo : "",
      correo : "",
      usuario_id : 0
    };
  }
}
