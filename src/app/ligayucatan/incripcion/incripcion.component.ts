import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { InicioService } from 'src/app/services/inicio.service';
import { InscripcionService } from 'src/app/services/inscripcion.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { LoginService } from 'src/app/services/login.service';
import { ReporteService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incripcion',
  templateUrl: './incripcion.component.html',
  styleUrls: ['./incripcion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IncripcionComponent implements OnInit {

  foto_rep : any;
  foto_en : any;
  foto_ay : any;
  public temporada = "";
  public detalle_ins : any;
  public solicitudes : any;
  public solicitud_seleccionada = 0;
  public observacion = "";
  @ViewChild('content',{}) modal;
  @ViewChild('equipo',{}) modalEquipo;
  datos = {
    "representante" : "",
    "curp_re" : "",
    "correo_re" : "",
    "telefono_re" : "",
    "entrenador" : "",
    "curp_en" : "",
    "correo_en" : "",
    "telefono_en" : "",
    "ayudante" : "",
    "correo_ay" : "",
    "curp_ay" : "",
    "telefono_ay" : "",
    "equipo" : "",
    "categoria" : "",
    "jugadores" : []
  };
  inscripcion_id = 0;

  constructor(
    private login_service : LoginService,
    private inscripcion_service : InscripcionService,
    private inicio_service : InicioService,
    private reporte_service : ReporteService,
    private modalService: NgbModal,
    private jugador_service : JugadoresService
  ) { }

  ngOnInit(): void {
    this.getTemporadaActual();
    this.pintarInscripciones();
    this.pintarSolicitudes();
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

  pintarInscripciones(){
    this.detalle_ins = [];
    this.inscripcion_service.obtenerInscripciones()
    .subscribe((object : any) => {
      if(object.ok){
        this.detalle_ins = object.data;
      }
    });
  }

  pintarSolicitudes(){
    this.solicitudes = [];
    this.inscripcion_service.obtenerSolicitudes()
    .subscribe((object : any) => {
      if(object.ok){
        this.solicitudes = object.data;
      }
    });
  }
  
  validar(id : number, tipo : number){
    if(tipo == 1){
      //Aceptar
      this.confirmar("Cofirmación","¿Seguro que deseas aceptar la solicitud?","info",1,id);
    }else{
      //Rechazar
      this.solicitud_seleccionada = id;
      this.observacion = "";
      this.openModal();
    }
  }

  rechazar(){
    if(this.observacion.length != 0){
      this.confirmar("Confirmación","¿Seguro que deseas rechazar la solicitud?","info",2,null);
    }else{
      Swal.fire("Ha ocurrido un error","La observación no puede estar vacia","error");
    }
  } 

  visualizar(id : number){
    this.inscripcion_service.obtenerRecibo(id)
    .subscribe((object : any) => {
      this.openBase64InNewTab(object.data.FotoRecibo, 'image/'+object.data.ExtRecibo);
    });
  }

  verEquipo(id : number){
    this.mostrarDatos(id+"");
    this.openModalEquipo();
  }

  bloquear(id : number, event : any){
    let tipo = 0;
    let template = "¿Seguro que deseas desbloquear al equipo?";
    if(event.checked){
      tipo = 1;
      template = "¿Seguro que deseas bloquear al equipo?";
    }
    Swal.fire({
      title: 'Confirmación',
      text: template,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscripcion_service.habilitarDeshabilitarEquipo(id,tipo)
        .subscribe((object : any) => {
          if(object.ok){
            Swal.fire("Buen trabajo",object.data,"success");
          }else{
            Swal.fire("Buen trabajo",object.message,"success");
          }
        });
      }else{
        if(tipo == 1){
          event.check;
        }else{
          event.uncheck;
        }
      }
    });
  }
  
  mostrarDatos(id : string){
    this.inicio_service.obtenerDatosPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.inscripcion_id = object.data.InscripcionID;
        this.datos.representante = object.data.Representante;
        this.datos.equipo = object.data.Equipo;
        this.datos.categoria = object.data.Categoria;
        this.datos.correo_re = object.data.MailRep;
        this.datos.curp_re = object.data.CurpRep;
        this.datos.telefono_re = object.data.TelRep;
        this.datos.entrenador = object.data.Entrenador;
        this.datos.correo_en = object.data.MailEnt;
        this.datos.curp_en = object.data.CurpEnt;
        this.datos.telefono_en = object.data.TelEnt;
        this.datos.ayudante = object.data.Ayudante;
        this.datos.correo_ay = object.data.MailAy;
        this.datos.curp_ay = object.data.CurpAy;
        this.datos.telefono_ay = object.data.TelAy;
        this.datos.jugadores = object.data.jugadores;
        this.foto_rep  = object.data.FotoRep;
        this.foto_en  = object.data.FotoEnt;
        this.foto_ay  = object.data.FotoAy;
      }
    });
  }
  
  verReporte(tipo : any, dato : any){
    let json = {};
    if(tipo == 1){
      json = {
        datos : {
          InscripcionID : this.inscripcion_id
        },
        nombre : "MiEquipo"
      };
    }
    if(tipo == 2){
      json = {
        datos : {
          JugadorID : dato
        },
        nombre : "Jugador"
      };
    }
    if(tipo == 3){
      json = {
        datos : {
          InscripcionID : this.inscripcion_id
        },
        nombre : "ReporteCarpeta"
      };
    }
    this.reporte_service.obtenerReporte(json)
    .subscribe((object : any) => {
      var byteCharacters = atob(object.data);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }

  
  eliminarJugador(id : number){
    this.confirmar("Confirmación","¿Seguro que deseas dar de baja al jugador?","info",2,id);
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
        if(tipo == 1){  //validar solicitud
          this.inscripcion_service.validarSolicitud(dato)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo",object.data,"success");
              this.pintarSolicitudes();
            }
          });
        }
        if(tipo == 2){
          this.jugador_service.bajaJugador(dato)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarDatos(dato);
              Swal.fire("Buen trabajo","El jugador ha sido eliminado","success");
            }
          });
        }
      }
    });
  }

  openBase64InNewTab (data, mimeType) {
    var byteCharacters = atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: mimeType + ';base64' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } 

  openModal() {
    this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title', centered : true, backdrop: 'static', keyboard: false});
  }

  openModalEquipo() {
    this.modalService.open(this.modalEquipo, {ariaLabelledBy: 'modal-basic-title', size : 'xl', centered : true, backdrop: 'static', keyboard: false});
  }

}
