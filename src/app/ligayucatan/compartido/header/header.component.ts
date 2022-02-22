import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  
  @ViewChild('content',{}) modal;
  myControl = new FormControl();
  usuarios : any; 
  busqueda = "";
  mostrar = true;
  info = {
    usuario : "",
    pass : ""
  };
  modal_obj : any;
  perfil = window.sessionStorage.getItem("Perfil");
  show = false;

  constructor(
    private modalService: NgbModal,
    private admin_service : AdminService){

  }

  ngOnInit() {
    if(this.perfil == "admin"){
      this.show = true;
    }else{
      this.show = false;
    }
  }
  
  mostrarUsuarios(){
    let json = {
      busqueda : this.busqueda
    };
    this.usuarios = [];
    this.admin_service.obtenerUsuariosTemp(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.usuarios = object.data;
      }
    });
  }
  selectEquipo(event : any){
    let id_usaurio = event.option.id;
    this.admin_service.getContra(id_usaurio)
    .subscribe((object : any) => {
      if(object.ok){
        this.mostrar = false;
        this.info.usuario = object.data.usuario;
        this.info.pass = object.data.contra;
      }
    });
  }

  openModal() {
    this.mostrarUsuarios();
    this.modal_obj = this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title', centered : true, backdrop: 'static', keyboard: false});
  }

  cerrarModal(){
    this.modal_obj.close();
    this.info = {
      usuario : "",
      pass : ""
    };
    this.mostrar = true;
    this.busqueda = "";
  }
}
