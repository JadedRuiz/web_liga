import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { InicioService } from 'src/app/services/inicio.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { ReporteService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  foto_rep : any;
  foto_en : any;
  foto_ay : any;
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
    "jugadores" : []
  };
  tipoModal = 0;
  @ViewChild('content',{}) modal;
  @ViewChild('modal_camera', {static: false}) modalCamera : any;
  usuario_id = window.sessionStorage.getItem("UsuarioID");
  inscripcion_id = window.sessionStorage.getItem("InscripcionID");
  public datos_edit = {
    InscripcionID : this.inscripcion_id,
    foto : "",
    extension : "",
    tipo : 0,
    nombre : "",
    apellido_p : "",
    apellido_m : "",
    curp  : "",
    tel : "",
    correo : ""
  };
  camera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  foto : any;

  constructor(
    private inicio_service : InicioService,
    private reporte_service : ReporteService,
    private modalService: NgbModal,
    private jugador_service : JugadoresService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.mostrarDatos();
  }

  visualizar(tipo : number,dato : number){
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

  mostrarDatos(){
    this.inicio_service.obtenerDatos(this.usuario_id)
    .subscribe((object : any) => {
      if(object.ok){
        this.datos.representante = object.data.Representante;
        this.datos.equipo = object.data.Equipo;
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
  editar(tipo : number){
    this.tipoModal = tipo;
    this.datos_edit.tipo = tipo;
    if(tipo == 1){
      let arreglo = this.datos.representante.split(" ");
      this.datos_edit.nombre = arreglo[2];
      this.datos_edit.apellido_p = arreglo[0];
      this.datos_edit.apellido_m = arreglo[1];
      this.datos_edit.curp = this.datos.curp_re;
      this.datos_edit.tel = this.datos.telefono_re;
      this.datos_edit.correo = this.datos.correo_re;
    }
    if(tipo == 2){
      let arreglo = this.datos.entrenador.split(" ");
      if(arreglo.length > 2){
        this.datos_edit.nombre = arreglo[2];
        this.datos_edit.apellido_p = arreglo[0];
        this.datos_edit.apellido_m = arreglo[1];
      }else{
        this.datos_edit.nombre = this.datos.entrenador;
        this.datos_edit.apellido_p = this.datos.entrenador;
        this.datos_edit.apellido_m = this.datos.entrenador;
      }
      this.datos_edit.curp = this.datos.curp_en;
      this.datos_edit.tel = this.datos.telefono_en;
      this.datos_edit.correo = this.datos.correo_en;
    }
    if(tipo == 3){
      let arreglo = this.datos.ayudante.split(" ");
      if(arreglo.length > 2){
        this.datos_edit.nombre = arreglo[2];
        this.datos_edit.apellido_p = arreglo[0];
        this.datos_edit.apellido_m = arreglo[1];
      }else{
        this.datos_edit.nombre = this.datos.ayudante;
        this.datos_edit.apellido_p = this.datos.ayudante;
        this.datos_edit.apellido_m = this.datos.ayudante;
      }
      this.datos_edit.curp = this.datos.curp_ay;
      this.datos_edit.tel = this.datos.telefono_ay;
      this.datos_edit.correo = this.datos.correo_ay;
    }
    this.openModal();
  }
  modificar(){
    this.confirmar("Confirmación","¿Seguro que deseas editarlo?","info",1,null);
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
        if(tipo == 1){  //Editar
          this.inicio_service.EditarDatos(this.datos_edit)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","La edición ha sido exitosa","success");
              this.mostrarDatos();
            }
          });
        }
        if(tipo == 2){
          this.jugador_service.bajaJugador(dato)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarDatos();
              Swal.fire("Buen trabajo","El jugador ha sido eliminado","success");
            }
          });
        }
      }
    });
  }
  
  openModal() {
    this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title', centered : true, backdrop: 'static', keyboard: false});
  }

  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  cambiarImagen(event: any | null = null){
    if(null){
      event.target.files[0] = "";
    }
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.datos_edit.foto = respuesta+"";
          this.datos_edit.extension = extension;
          if(this.tipoModal == 1){
            this.foto_rep = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          }
          if(this.tipoModal == 2){
            this.foto_en = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          }
          if(this.tipoModal == 3){
            this.foto_ay = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          }
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
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

  tomarFoto(){
    this.camera = this.modalService.open(this.modalCamera, { scrollable: true, size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    let url_foto = webcamImage.imageAsDataUrl;
    let docB64 = url_foto.split(",");
    this.foto = docB64[1];
    this.datos_edit.foto = docB64[1];
    this.datos_edit.extension = "jpg";
    if(this.tipoModal == 1){
      this.foto_rep = webcamImage.imageAsDataUrl;
    }
    if(this.tipoModal == 2){
      this.foto_en = webcamImage.imageAsDataUrl;
    }
    if(this.tipoModal == 3){
      this.foto_ay = webcamImage.imageAsDataUrl;
    }
    this.camera.close();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
