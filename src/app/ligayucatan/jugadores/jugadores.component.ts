import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import * as $ from 'jquery';
import { JugadoresService } from 'src/app/services/jugadores.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})
export class JugadoresComponent implements OnInit {

  form = true;
  myControl = new FormControl();
  inscricion_id = window.sessionStorage.getItem("InscripcionID");
  usuario_id = window.sessionStorage.getItem("UsuarioID");
  @ViewChild('modal_camera', {static: false}) modalCamera : any;
  camera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  foto : any;
  jugador = {
    InscripcionID : this.inscricion_id,
    JugadorId : 0,
    curp : "",
    apellido_p : "",
    apellido_m : "",
    nombre : "",
    fecha_nacimiento : "",
    sexo : "-1",
    correo : "",
    telefono : "",
    calle : "",
    cruzamiento_uno : "",
    cruzamiento_dos : "",
    num_exterior : "",
    num_int : "",
    colonia : "",
    municipio : "",
    estado : "",
    cp : "",
    nota : "",
    apellido_m_rep : "",
    apellido_p_rep : "",
    nombre_rep : "",
    tel_rep : "",
    correo_rep : "",
    apellido_pp : "",
    apellido_mp : "",
    nombre_p : "",
    apellido_pm : "",
    apellido_mm : "",
    nombre_m : "",
    telefono_p : "",
    telefono_m : "",
    foto_jugador : "",
    extension : ""
  };
  tipo_btn = 0;
  @ViewChild('myInput') myInputVariable: ElementRef;
  

  constructor(
    private modal_service : NgbModal,
    private jugador_service : JugadoresService,
    private sanitizer: DomSanitizer
  ) { 
    this.foto = "../assets/logos/avatar.jpg";
  }

  ngOnInit(): void {
    $("#titlulo_header").html('Jugadores');
  }

  validar(){
    if(this.jugador.curp.length > 17){
      let json = {
        InscripcionID : this.inscricion_id,
        curp : this.jugador.curp
      };
      this.jugador_service.validarCurp(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.foto = object.data[0].Fotografia;
          this.jugador.JugadorId = object.data[0].JugadorID;
          this.jugador.apellido_p = object.data[0].ApellidoPaterno;
          this.jugador.apellido_m = object.data[0].ApellidoMaterno;
          this.jugador.nombre = object.data[0].Nombre;
          this.jugador.calle = object.data[0].Calle;
          this.jugador.num_int = object.data[0].Num_int;
          this.jugador.num_exterior = object.data[0].Num_ext;
          this.jugador.cruzamiento_uno = object.data[0].Cruzamiento_uno;
          this.jugador.cruzamiento_dos = object.data[0].Cruzamiento_dos;
          this.jugador.colonia = object.data[0].Colonia;
          this.jugador.municipio = object.data[0].Municipio;
          this.jugador.sexo = object.data[0].Sexo;
          this.jugador.telefono = object.data[0].Telefono;
          this.jugador.apellido_p_rep = object.data[0].apellido_p_rep;
          this.jugador.apellido_m_rep = object.data[0].apellido_m_rep;
          this.jugador.nombre_rep = object.data[0].nombre_rep;
          this.jugador.tel_rep = object.data[0].tel_rep;
          this.jugador.correo_rep = object.data[0].correo_rep;
          this.jugador.apellido_pp = object.data[0].APPadre;
          this.jugador.apellido_mp = object.data[0].AMPadre;
          this.jugador.nombre_p = object.data[0].NPadre;
          this.jugador.apellido_pm = object.data[0].APMadre;
          this.jugador.apellido_mm = object.data[0].AMMadre;
          this.jugador.nombre_m = object.data[0].NMadre;
          this.jugador.telefono_p = object.data[0].TelPadre;
          this.jugador.telefono_m = object.data[0].TelMadre;
          this.jugador.cp = object.data[0].CodigoPostal;
          this.jugador.fecha_nacimiento = object.data[0].FechaNacimiento;
          this.tipo_btn = 2;
          this.form = false;
        }else{
          this.form = false;
          this.tipo_btn = 1;
        }
      });
    }
  }

  guardar(){
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta a este jugador en tu equipo?","info",1);
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number){
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
        if(tipo == 1){  //enviar
          this.jugador_service.altaJugador(this.jugador)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo",object.data,"success");
              this.limpiarCampos();
              this.form = true;
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }

  limpiarCampos(){
    this.jugador = {
      InscripcionID : this.inscricion_id,
      JugadorId : 0,
      curp : "",
      apellido_p : "",
      apellido_m : "",
      nombre : "",
      fecha_nacimiento : "",
      sexo : "-1",
      correo : "",
      telefono : "",
      calle : "",
      cruzamiento_uno : "",
      cruzamiento_dos : "",
      num_exterior : "",
      num_int : "",
      colonia : "",
      municipio : "",
      estado : "",
      cp : "",
      nota : "",
      apellido_m_rep : "",
      apellido_p_rep : "",
      nombre_rep : "",
      tel_rep : "",
      correo_rep : "",
      apellido_pp : "",
      apellido_mp : "",
      nombre_p : "",
      apellido_pm : "",
      apellido_mm : "",
      nombre_m : "",
      telefono_p : "",
      telefono_m : "",
      foto_jugador : "",
      extension : ""
    }
    this.myInputVariable.nativeElement.value = "";
    this.foto = "../assets/logos/avatar.jpg";
  }

  convertirImagenAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  cambiarImagen(event: any | null = null){
    if(null){
      event.target.files[0] = "";
    }
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "jpg" || extension == "png" || extension == "JPG" || extension == "PNG'"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.foto = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.jugador.foto_jugador = respuesta+"";
          this.jugador.extension = extension;
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }

  tomarFoto(){
    this.camera = this.modal_service.open(this.modalCamera, { scrollable: true, size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }
  
  takeSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    this.foto = webcamImage.imageAsDataUrl;
    let url_foto = webcamImage.imageAsDataUrl;
    let docB64 = url_foto.split(",");
    this.jugador.foto_jugador = docB64[1];
    this.jugador.extension = "jpeg";
    this.camera.close();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
